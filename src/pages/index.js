import { useEffect, useState, useCallback } from 'react'
import io from 'socket.io-client'

import styles from '@/styles/Home.module.css'

import { useSensorData, useUpdateSensorData, useClearSensorData } from '@/context/SensorDataContext'
import Plots from '@/components/Plots'
import DownloadDataButton from '@/components/DownloadDataButton'

let socket = null

export default function Home() {
  const [connectionStatus, setConnectionStatus] = useState("Not connected")
  const sensorData = useSensorData()
  const updateSensorData = useUpdateSensorData()
  const clearSensorData = useClearSensorData()

  function connectWebsocket() {
    setConnectionStatus("Connecting...")

    fetch('/api/socket')
      .then(() => {

        if (!socket) {
          socket = io(global.io)

          socket.on('connect', () => {
            setConnectionStatus("Connected")
          })

          socket.on('message', (message) => updateSensorData(message))

          socket.on('disconnect', () => {
            socket = null
            setConnectionStatus("Not connected")
          })
        }

      })
  }

  useEffect(() => connectWebsocket(), [])

  return (
    <>
      <h1 className={styles.heading}>DAQ Platform</h1>
      <p>{connectionStatus}</p>
      <button onClick={() => socket?.disconnect() || connectWebsocket()}>connect/disonnect</button>
      <button onClick={() => clearSensorData()}>clear</button>

      {
        Object.keys(sensorData).map((sensorId, i) => {
          return <DownloadDataButton sensorID={sensorId} data={sensorData[sensorId].data} key={i} />
        })
      }

      <Plots />

      {/* <pre>{JSON.stringify(groupedData, null, 2)}</pre> */}
    </>

  )
}
