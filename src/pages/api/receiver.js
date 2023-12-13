const validSensorIds = ['sensor1', 'sensor2']

function handleMessage(message) {
  let res = {}

  if (global.io && validSensorIds.indexOf(message.sensorId) !== -1) {

    global.io.emit('message', message)

    res.time = Date.now()
    res.data = "Server got " + message.data + " from " + message.sensorId

  }
  else {
    
    let msg = ""

    if (!global.io) {
      msg += " | Server offline"
    }
    if (validSensorIds.indexOf(message.sensorId) !== -1) {
      msg += " | Invalid sensor id"
    }

    msg = msg.slice(3)

    res.time = Date.now()
    res.data = msg || "Some error occured"

  }

  return res
}

export default function Receiver(req, res) {

  const messageList = Array.isArray(req.body) ? req.body : [req.body]

  const outputs = messageList.map(el => handleMessage(el))

  res.send(outputs)

}