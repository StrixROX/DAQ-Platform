import { useCallback } from 'react'

function generateCSVBlob(sensorId, data) {
  let out = [`Time (s), Elapsed Time (s), ${sensorId}\n`]

  for (const el of data) {
    out.push(`${el.time}, ${el.elapsedTime}, ${el.data}\n`)
  }

  return new Blob(out, { type: "text/csv" })
}

export default function DownloadDataButton({ sensorID, data, styles }) {
  if (!data) {
    return null
  }

  const filename = `${sensorID}.csv`

  const downloadData = useCallback((sensorId, data) => {
    const blob = generateCSVBlob(sensorId, data)

    const el = document.createElement('a')
    el.setAttribute('href', URL.createObjectURL(blob))
    el.setAttribute('download', filename)
    el.click()
    el.remove()

  }, [])

  return (
    <button className={styles} onClick={() => downloadData(sensorID, data)}>
      Download {filename}
    </button>
  )
}