import { createContext, useContext, useState } from 'react'

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

let startTime = null

export default function SensorDataProvider({ children }) {
  const [groupedSensorData, setGroupedSensorData] = useState({})

  function updateSensorData(windowSize, message) {
    if (validate(message)) {
      const sensorId = message.sensorId
      startTime = startTime ?? message.time
      message.elapsedTime = (message.time - startTime) / 1000 // seconds

      setGroupedSensorData(prev => {

        let newData = prev?.hasOwnProperty(sensorId) ? [...prev[sensorId].data, message] : [message]

        while (newData.length > windowSize) {
          newData = newData.slice(1)
        }

        const out = { ...prev }
        out[sensorId] = {
          data: newData
        }

        return out
      })
    }
  }
  
  function clearSensorData() {
    startTime = null
    setGroupedSensorData({})
  }

  return (
    <SensorDataContext.Provider value={groupedSensorData}>
      <UpdateSensorDataContext.Provider value={updateSensorData}>
        <ClearSensorDataContext.Provider value={clearSensorData}>
          {children}
        </ClearSensorDataContext.Provider>
      </UpdateSensorDataContext.Provider>
    </SensorDataContext.Provider>
  )
}