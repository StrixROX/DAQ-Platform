import '@/styles/globals.css'
import Head from 'next/head'

import SensorDataProvider from '@/context/SensorDataContext'
import DarkModeProvider from '@/context/DarkModeContext'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>DAQ Platform</title>
        <meta name="description" content="A real-time sensor data monitoring platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SensorDataProvider>
        <DarkModeProvider>
          <Component {...pageProps} />
        </DarkModeProvider>
      </SensorDataProvider>
    </>
  )
}
