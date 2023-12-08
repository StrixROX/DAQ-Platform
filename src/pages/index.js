import { useEffect, useState, useCallback } from 'react'
import io from 'socket.io-client'

import styles from '@/styles/Home.module.css'

import Plots from '@/components/Plots'
import { useSensorData, useUpdateSensorData, useClearSensorData } from '@/context/SensorDataContext'

function validate(data) {
  return typeof (data?.time) === 'number' && typeof (data?.data) === 'number' && typeof (data?.sensorId) === 'string'
}

function generateBlob(sensorId, data) {
  let out = [`Time (s), Elapsed Time (s), ${sensorId}\n`]

  for (const el of data) {
    out.push(`${el.time}, ${el.elapsedTime}, ${el.data}\n`)
  }

  return new Blob(out, { type: "text/csv" })
}

let socket = null
const windowSize = 20

export default function Home() {
  const [connectionStatus, setConnectionStatus] = useState("Not connected")
  const sensorData = useSensorData()
  const updateSensorData = useUpdateSensorData()
  const clearSensorData = useClearSensorData()

  function connect() {
    setConnectionStatus("Connecting...")

    fetch('/api/socket')
      .then(() => {

        if (!socket) {
          socket = io()

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

  useEffect(() => connect(), [])

  const downloadData = useCallback((sensorId, data) => {
    const blob = generateBlob(sensorId, data)

    const el = document.createElement('a')
    el.setAttribute('href', URL.createObjectURL(blob))
    el.setAttribute('download', `${sensorId}.csv`)
    el.click()
    el.remove()
  }, [])

  return (
    <>
      <h1 className={styles.heading}>DAQ Platform</h1>
      <p>{connectionStatus}</p>
      <button onClick={() => socket?.disconnect() || connect()}>connect/disonnect</button>
      <button onClick={() => clearSensorData()}>clear</button>

      {Object.keys(sensorData).map((sensorId, i) => {
        return (
          <button onClick={() => downloadData(sensorId, sensorData[sensorId].data)} key={i}>
            Download {sensorId}.csv
          </button>
        )
      })}

      <Plots />

      {/* <pre>{JSON.stringify(groupedData, null, 2)}</pre> */}
    </>

  )
}
