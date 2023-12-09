import { useEffect, useState, useMemo } from 'react'
import io from 'socket.io-client'

import lightStyles from '@/styles/Home.module.css'
import darkStyles from '@/styles/Home.dark.module.css'

import { useSensorData, useUpdateSensorData, useClearSensorData } from '@/context/SensorDataContext'
import Plots from '@/components/Plots'
import PlotsDark from '@/components/Plots.Dark'
import DownloadDataButton from '@/components/DownloadDataButton'

let socket = null

export default function Home() {
  const [darkMode, setDarkMode] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState(0)

  const sensorData = useSensorData()
  const updateSensorData = useUpdateSensorData()
  const clearSensorData = useClearSensorData()

  const styles = useMemo(() => darkMode ? darkStyles : lightStyles, [darkMode])

  const connectionStatusNames = {
    0: "Not connected",
    1: "Connected",
    2: "Connecting..."
  }

  const toggleDarkMode = () => setDarkMode(prev => !prev)

  function connectWebsocket() {
    setConnectionStatus(2)

    fetch('/api/socket')
      // .then(async () => await new Promise((resolve) => {setTimeout(resolve, 1000)}))
      .then(() => {

        if (!socket) {
          socket = io(global.io)

          socket.on('connect', () => {
            setConnectionStatus(1)
          })

          socket.on('message', (message) => updateSensorData(message))

          socket.on('disconnect', () => {
            socket = null
            setConnectionStatus(0)
          })
        }

      })
  }

  useEffect(() => connectWebsocket(), [])

  return (
    <>
      <header className={styles.header}>
        <div>
          <h1 className={styles.heading}>DAQ Platform</h1>
          <h3 className={styles.subheading}>A real-time sensor data monitoring platform</h3>
          <div className={styles.downloadBar}>
            {
              Object.keys(sensorData).sort().map((sensorId, i) => {
                return <DownloadDataButton sensorID={sensorId} data={sensorData[sensorId].data} styles={styles.downloadButton} key={i} />
              })
            }
          </div>
        </div>
        <div className={styles.connectionSettings}>
          <p align="center" className={connectionStatus === 1 ? styles.isConnected : styles.isNotConnected}>{connectionStatusNames[connectionStatus]}</p>
          <button className={styles.button} onClick={() => socket?.disconnect() || connectWebsocket()}>Connect/Disonnect</button>
          <button className={styles.button} onClick={() => toggleDarkMode()}>Dark Mode</button>
          <button className={styles.button} onClick={() => clearSensorData()}>Reset</button>
        </div>
      </header>

      <div className={styles.plotsWrapper}>
        {darkMode ? <PlotsDark /> : <Plots />}
      </div>

      {/* <pre>{JSON.stringify(groupedData, null, 2)}</pre> */}
    </>

  )
}
