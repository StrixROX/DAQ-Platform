'use client'

import { useEffect, useState } from 'react'
import io from 'socket.io-client'

import styles from '@/styles/home.module.css'

function delay(duration) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration)
  })
}

let socket = null

export default function Home() {
  const [connectionStatus, setConnectionStatus] = useState("Not connected")
  const [dataStream, setDataStream] = useState([])

  function connect() {
    setConnectionStatus("Connecting...")

    fetch('/api/socket')
      .then(() => delay(2000))
      .then(() => {

        if (!socket) {
          socket = io()

          socket.on('connect', () => {
            setConnectionStatus("Connected")
          })

          socket.on('message', (message) => {
            setDataStream(prev => [...prev, message])
          })

          socket.on('disconnect', () => {
            socket = null
            setConnectionStatus("Not connected")
          })
        }

      })
  }

  useEffect(() => connect(), [])

  return (
    <>
      <h1 className={styles.heading}>DAQ Platform</h1>
      <p>{connectionStatus}</p>
      <button onClick={() => socket?.disconnect() || connect()}>connect/disonnect</button>
      <button onClick={() => setDataStream([])}>clear</button>
      <pre>{JSON.stringify(dataStream, null, 2)}</pre>
    </>
  )
}
