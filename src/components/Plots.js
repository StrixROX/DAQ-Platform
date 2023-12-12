import { useDarkMode } from '@/context/DarkModeContext'
import { useSensorData } from '@/context/SensorDataContext'
import { VictoryChart, VictoryLine, VictoryScatter, VictoryTheme, VictoryAxis, VictoryLabel, VictoryLegend } from 'victory'

function ChartWrapper({ legend, colorScale, children }) {
  const darkMode = useDarkMode()

  const darkAxisStyles = {
    axis: { stroke: "#c9c9c9" },
    axisLabel: { fill: "#c9c9c9" },
    ticks: { stroke: "#c9c9c9" },
    tickLabels: { fill: "#c9c9c9" }
  }

  return (
    <VictoryChart theme={VictoryTheme.material} height={300} width={1000}>
      {children}

      <VictoryLegend x={800} y={2}
        orientation="vertical"
        gutter={20}
        style={{ border: { stroke: darkMode ? "#c9c9c9" : "black" }, labels: { fill: darkMode ? "#c9c9c9" : "black" } }}
        colorScale={colorScale}
        data={legend.map(el => ({ name: el }))}
      />

      <VictoryAxis
        width={400}
        height={400}
        style={darkMode ? darkAxisStyles : null}
        theme={VictoryTheme.material}
        label="Time Elapsed (s)"
        axisLabelComponent={<VictoryLabel dy={20} />}
        standalone={false}
      />
      <VictoryAxis dependentAxis
        style={darkMode ? darkAxisStyles : null}
        theme={VictoryTheme.material}
        label="Sensor Reading"
        axisLabelComponent={<VictoryLabel dy={-25} />}
        standalone={false}
      />
    </VictoryChart>
  )
}

export default function Plots() {
  const sensorData = useSensorData()

  return (
    <>
      <ChartWrapper legend={['sensor1', 'sensor2']} colorScale={['#8884d8', '#ff4400']}>
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
      </ChartWrapper>

      <ChartWrapper legend={['sensor1']} colorScale={['#8884d8']}>
        <VictoryLine
          style={{
            data: { stroke: "#8884d8", strokeWidth: 0.8 },
            parent: { border: "1px solid #ccc" }
          }}
          data={sensorData['sensor1']?.data?.reduce((acc, val) => [...acc, { x: val.elapsedTime, y: val.data }], [])}
        />
      </ChartWrapper>

      <ChartWrapper legend={['sensor2']} colorScale={['#ff4400']}>
        <VictoryLine
          style={{
            data: { stroke: "#ff4400", strokeWidth: 0.8 },
            parent: { border: "1px solid #ccc" }
          }}
          data={sensorData['sensor2']?.data?.reduce((acc, val) => [...acc, { x: val.elapsedTime, y: val.data }], [])}
        />
      </ChartWrapper>
    </>
  )
}