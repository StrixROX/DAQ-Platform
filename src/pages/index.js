import { useEffect, useState, useCallback } from 'react'
import io from 'socket.io-client'
import { VictoryChart, VictoryLine, VictoryScatter, VictoryTheme, VictoryAxis, VictoryLabel, VictoryLegend } from 'victory'

import styles from '@/styles/Home.module.css'

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

      <VictoryChart theme={VictoryTheme.material} height={300} width={1000}>
        <VictoryLine
          name="sensor1"
          style={{
            data: { stroke: "#8884d8", strokeWidth: 0.8 },
            parent: { border: "1px solid #ccc" }
          }}
          data={groupedData['sensor1']?.data?.reduce((acc, val) => [...acc, { x: val.elapsedTime, y: val.data }], [])}
        />
        <VictoryLine
          name="sensor2"
          style={{
            data: { stroke: "#ff4400", strokeWidth: 0.8 },
            parent: { border: "1px solid #ccc" }
          }}
          data={groupedData['sensor2']?.data?.reduce((acc, val) => [...acc, { x: val.elapsedTime, y: val.data }], [])}
        />
        <VictoryLegend x={800} y={10}
          orientation="vertical"
          gutter={20}
          style={{ border: { stroke: "black" } }}
          colorScale={["#8884d8", "#ff4400"]}
          data={[
            { name: "sensor1" }, { name: "sensor2" }
          ]}
        />
        <VictoryAxis
          width={400}
          height={400}
          theme={VictoryTheme.material}
          label="Time Elapsed (s)"
          axisLabelComponent={<VictoryLabel dy={20}/>}
          standalone={false}
        />
        <VictoryAxis dependentAxis
          theme={VictoryTheme.material}
          label="Sensor Reading"
          axisLabelComponent={<VictoryLabel dy={-25}/>}
          standalone={false}
        />
      </VictoryChart>

      <VictoryChart theme={VictoryTheme.material} height={300} width={1000}>
        <VictoryLine
          style={{
            data: { stroke: "#8884d8", strokeWidth: 0.8 },
            parent: { border: "1px solid #ccc" }
          }}
          data={groupedData['sensor1']?.data?.reduce((acc, val) => [...acc, { x: val.elapsedTime, y: val.data }], [])}
        />
        <VictoryLegend x={800} y={10}
          orientation="vertical"
          gutter={20}
          style={{ border: { stroke: "black" } }}
          colorScale={["#8884d8"]}
          data={[
            { name: "sensor1" }
          ]}
        />
        <VictoryAxis
          width={400}
          height={400}
          theme={VictoryTheme.material}
          label="Time Elapsed (s)"
          axisLabelComponent={<VictoryLabel dy={20}/>}
          standalone={false}
        />
        <VictoryAxis dependentAxis
          theme={VictoryTheme.material}
          label="Sensor Reading"
          axisLabelComponent={<VictoryLabel dy={-25}/>}
          standalone={false}
        />
      </VictoryChart>

      <VictoryChart theme={VictoryTheme.material} height={300} width={1000}>
        <VictoryLine
          style={{
            data: { stroke: "#ff4400", strokeWidth: 0.8 },
            parent: { border: "1px solid #ccc" }
          }}
          data={groupedData['sensor2']?.data?.reduce((acc, val) => [...acc, { x: val.elapsedTime, y: val.data }], [])}
        />
        <VictoryLegend x={800} y={10}
          orientation="vertical"
          gutter={20}
          style={{ border: { stroke: "black" } }}
          colorScale={["#ff4400"]}
          data={[
            { name: "sensor2" }
          ]}
        />
        <VictoryAxis
          width={400}
          height={400}
          theme={VictoryTheme.material}
          label="Time Elapsed (s)"
          axisLabelComponent={<VictoryLabel dy={20}/>}
          standalone={false}
        />
        <VictoryAxis dependentAxis
          theme={VictoryTheme.material}
          label="Sensor Reading"
          axisLabelComponent={<VictoryLabel dy={-25}/>}
          standalone={false}
        />
      </VictoryChart>

      {/* <pre>{JSON.stringify(groupedData, null, 2)}</pre> */}
    </>

  )
}
