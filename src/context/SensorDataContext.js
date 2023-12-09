import { createContext, useContext, useState } from 'react'

const WINDOW_SIZE = Number(process.env.NEXT_PUBLIC_WINDOW_SIZE) || 20

const SensorDataContext = createContext()
const UpdateSensorDataContext = createContext()
const ClearSensorDataContext = createContext()

export function useSensorData() {
  return useContext(SensorDataContext)
}

export function useUpdateSensorData() {
  return useContext(UpdateSensorDataContext)
}

export function useClearSensorData() {
  return useContext(ClearSensorDataContext)
}

function validate(data) {
  return typeof (data?.time) === 'number' && typeof (data?.data) === 'number' && typeof (data?.sensorId) === 'string'
}

export default function SensorDataProvider({ children }) {
  const [groupedSensorData, setGroupedSensorData] = useState({})

  function updateSensorData(message) {
    if (validate(message)) {
      const sensorId = message.sensorId

      setGroupedSensorData(prev => {
        const startTime = prev?.hasOwnProperty(sensorId) ? prev[sensorId].startTime : message.time

        message.elapsedTime = (message.time - startTime) / 1000 // seconds

        let newData = prev?.hasOwnProperty(sensorId) ? [...prev[sensorId].data, message] : [message]

        if (newData.length > WINDOW_SIZE) {
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
  }

  return (
    <SensorDataContext.Provider value={groupedSensorData}>
      <UpdateSensorDataContext.Provider value={updateSensorData}>
        <ClearSensorDataContext.Provider value={() => setGroupedSensorData({})}>
          {children}
        </ClearSensorDataContext.Provider>
      </UpdateSensorDataContext.Provider>
    </SensorDataContext.Provider>
  )
}