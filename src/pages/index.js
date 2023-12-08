import { useEffect, useState, useCallback } from 'react'
import io from 'socket.io-client'
import { LineChart, Line, XAxis, YAxis, Legend, Label, ResponsiveContainer } from 'recharts'

import styles from '@/styles/Home.module.css'

function validate(data) {
  return typeof (data?.time) === 'number' && typeof (data?.data) === 'number' && typeof (data?.sensorId) === 'string'
}

function generateBlob(sensorId, data) {
  let out = [`Elapsed Time (s), ${sensorId}\n`]

  for (const el of data) {
    out.push(`${el.elapsedTime}, ${el.data}\n`)
  }

  return new Blob(out, { type: "text/csv" })
}

let socket = null
const windowSize = 100000

export default function Home() {
  const [connectionStatus, setConnectionStatus] = useState("Not connected")
  const [groupedData, setGroupedData] = useState({})

  function connect() {
    setConnectionStatus("Connecting...")

    fetch('/api/socket')
      .then(() => {

        if (!socket) {
          socket = io()

          socket.on('connect', () => {
            setConnectionStatus("Connected")
          })

          socket.on('message', (message) => {
            if (validate(message)) {
              const sensorId = message.sensorId

              setGroupedData(prev => {
                const startTime = prev.hasOwnProperty(sensorId) ? prev[sensorId].startTime : message.time
                const elapsedTime = (message.time - startTime) / 1000 // seconds
                
                message.elapsedTime = elapsedTime

                let newData = prev.hasOwnProperty(sensorId) ? [...prev[sensorId].data, message] : [message]
                
                if (newData.length > windowSize) {
                  newData = newData.slice(1)
                }

                const out = { ...prev }
                out[sensorId] = {
                  startTime,
                  data: newData
                }

                return out
              })
            }
          })

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
      <button onClick={() => setGroupedData({})}>clear</button>

      {Object.keys(groupedData).map((sensorId, i) => {
        return (
          <button onClick={() => downloadData(sensorId, groupedData[sensorId].data)}>
            Download {sensorId}.csv
          </button>
        )
      })}

      <ResponsiveContainer width="100%" height={400} >
        <LineChart margin={{ "top": 25, "bottom": 25, "left": 25, "right": 25 }} data={groupedData['sensor1']?.data ?? [null]}>
          <Line name="sensor1" type="linear" dataKey="data" stroke="#8884d8" dot={false} activeDot={true} isAnimationActive={false} />
          <XAxis dataKey="elapsedTime">
            <Label value="Time elapsed (s)" offset={10} position="bottom" />
          </XAxis>
          <YAxis dataKey="data" />
          <Legend layout="vertical" align="right" verticalAlign="top" />
        </LineChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={400} >
        <LineChart margin={{ "top": 25, "bottom": 25, "left": 25, "right": 25 }} data={groupedData['sensor2']?.data ?? [null]}>
          <Line name="sensor2" type="linear" dataKey="data" stroke="#8884d8" dot={false} activeDot={true} isAnimationActive={false} />
          <XAxis dataKey="elapsedTime">
            <Label value="Time elapsed (s)" offset={10} position="bottom" />
          </XAxis>
          <YAxis dataKey="data" />
          <Legend layout="vertical" align="right" verticalAlign="top" />
        </LineChart>
      </ResponsiveContainer>

      {/* <pre>{JSON.stringify(groupedData, null, 2)}</pre> */}
    </>
  )
}
