import '@/styles/globals.css'
import Head from 'next/head'

import SensorDataProvider from '@/context/SensorDataContext'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>DAQ Platform</title>
        <meta name="description" content="A real-time monitoring DAQ platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SensorDataProvider>
        <Component {...pageProps} />
      </SensorDataProvider>
    </>
  )
}
