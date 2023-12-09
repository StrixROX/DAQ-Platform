import { useSensorData } from '@/context/SensorDataContext'
import { VictoryChart, VictoryLine, VictoryScatter, VictoryTheme, VictoryAxis, VictoryLabel, VictoryLegend } from 'victory'

export default function PlotsDark() {
  const sensorData = useSensorData()

  return (
    <>
      <VictoryChart theme={VictoryTheme.material} height={300} width={1000}>
        <VictoryLine
          name="sensor1"
          style={{
            data: { stroke: "#8884d8", strokeWidth: 0.8 },
            parent: { border: "1px solid #ccc" }
          }}
          data={sensorData['sensor1']?.data?.reduce((acc, val) => [...acc, { x: val.elapsedTime, y: val.data }], [])}
        />
        <VictoryLine
          name="sensor2"
          style={{
            data: { stroke: "#ff4400", strokeWidth: 0.8 },
            parent: { border: "1px solid #ccc" }
          }}
          data={sensorData['sensor2']?.data?.reduce((acc, val) => [...acc, { x: val.elapsedTime, y: val.data }], [])}
        />
        <VictoryLegend x={800} y={10}
          orientation="vertical"
          gutter={20}
          style={{ border: { stroke: "#c9c9c9" }, labels: { fill: "#c9c9c9" } }}
          colorScale={["#8884d8", "#ff4400"]}
          data={[
            { name: "sensor1" }, { name: "sensor2" }
          ]}
        />
        <VictoryAxis
          width={400}
          height={400}
          style={{ axis: { stroke: "#c9c9c9" }, axisLabel: { fill: "#c9c9c9" }, ticks: { stroke: "#c9c9c9" }, tickLabels: { fill: "#c9c9c9" } }}
          theme={VictoryTheme.material}
          label="Time Elapsed (s)"
          axisLabelComponent={<VictoryLabel dy={20} />}
          standalone={false}
        />
        <VictoryAxis dependentAxis
          style={{ axis: { stroke: "#c9c9c9" }, axisLabel: { fill: "#c9c9c9" }, ticks: { stroke: "#c9c9c9" }, tickLabels: { fill: "#c9c9c9" } }}
          theme={VictoryTheme.material}
          label="Sensor Reading"
          axisLabelComponent={<VictoryLabel dy={-30} />}
          standalone={false}
        />
      </VictoryChart>

      <VictoryChart theme={VictoryTheme.material} height={300} width={1000}>
        <VictoryLine
          style={{
            data: { stroke: "#8884d8", strokeWidth: 0.8 },
            parent: { border: "1px solid #ccc" }
          }}
          data={sensorData['sensor1']?.data?.reduce((acc, val) => [...acc, { x: val.elapsedTime, y: val.data }], [])}
        />
        <VictoryLegend x={800} y={10}
          orientation="vertical"
          gutter={20}
          style={{ border: { stroke: "#c9c9c9" }, labels: { fill: "#c9c9c9" } }}
          colorScale={["#8884d8"]}
          data={[
            { name: "sensor1" }
          ]}
        />
        <VictoryAxis
          width={400}
          height={400}
          style={{ axis: { stroke: "#c9c9c9" }, axisLabel: { fill: "#c9c9c9" }, ticks: { stroke: "#c9c9c9" }, tickLabels: { fill: "#c9c9c9" } }}
          theme={VictoryTheme.material}
          label="Time Elapsed (s)"
          axisLabelComponent={<VictoryLabel dy={20} />}
          standalone={false}
        />
        <VictoryAxis dependentAxis
          style={{ axis: { stroke: "#c9c9c9" }, axisLabel: { fill: "#c9c9c9" }, ticks: { stroke: "#c9c9c9" }, tickLabels: { fill: "#c9c9c9" } }}
          theme={VictoryTheme.material}
          label="Sensor Reading"
          axisLabelComponent={<VictoryLabel dy={-30} />}
          standalone={false}
        />
      </VictoryChart>

      <VictoryChart theme={VictoryTheme.material} height={300} width={1000}>
        <VictoryLine
          style={{
            data: { stroke: "#ff4400", strokeWidth: 0.8 },
            parent: { border: "1px solid #ccc" }
          }}
          data={sensorData['sensor2']?.data?.reduce((acc, val) => [...acc, { x: val.elapsedTime, y: val.data }], [])}
        />
        <VictoryLegend x={800} y={10}
          orientation="vertical"
          gutter={20}
          style={{ border: { stroke: "#c9c9c9" }, labels: { fill: "#c9c9c9" } }}
          colorScale={["#ff4400"]}
          data={[
            { name: "sensor2" }
          ]}
        />
        <VictoryAxis
          width={400}
          height={400}
          style={{ axis: { stroke: "#c9c9c9" }, axisLabel: { fill: "#c9c9c9" }, ticks: { stroke: "#c9c9c9" }, tickLabels: { fill: "#c9c9c9" } }}
          theme={VictoryTheme.material}
          label="Time Elapsed (s)"
          axisLabelComponent={<VictoryLabel dy={20} />}
          standalone={false}
        />
        <VictoryAxis dependentAxis
          style={{ axis: { stroke: "#c9c9c9" }, axisLabel: { fill: "#c9c9c9" }, ticks: { stroke: "#c9c9c9" }, tickLabels: { fill: "#c9c9c9" } }}
          theme={VictoryTheme.material}
          label="Sensor Reading"
          axisLabelComponent={<VictoryLabel dy={-30} />}
          standalone={false}
        />
      </VictoryChart>
    </>
  )
}