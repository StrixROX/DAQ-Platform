import { createContext, useContext, useState } from 'react'

const DarkModeContext = createContext()
const ToggleDarkModeContext = createContext()

export function useDarkMode() {
  return useContext(DarkModeContext)
}

export function useToggleDarkMode() {
  return useContext(ToggleDarkModeContext)
}

export default function DarkModeProvider({ children }) {
  const [darkmode, setDarkMode] = useState(false)

  function toggleDarkMode() {
    setDarkMode(prev => !prev)
  }

  return (
    <DarkModeContext.Provider value={darkmode}>
      <ToggleDarkModeContext.Provider value={toggleDarkMode}>
        { children }
      </ToggleDarkModeContext.Provider>
    </DarkModeContext.Provider>
  )

}
