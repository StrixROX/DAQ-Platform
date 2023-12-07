const validSensorIds = ['sensor1', 'sensor2']

export default function Receiver(req, res) {
  if (global.io && validSensorIds.indexOf(req.body.sensorId) !== -1) {

    global.io.emit('message', req.body)

    res.send({
      time: Date.now(),
      data: "Server got " + req.body.data + " from " + req.body.sensorId
    })

  }
  else {

    let msg = []

    if (!global.io) {
      msg.push("Server offline")
    }
    if (validSensorIds.indexOf(req.body.sensorId) === -1) {
      msg.push("Invalid sensor id")
    }

    res.send({
      time: Date.now(),
      data: msg.join(' | ') || "Some error occurred"
    })

  }
}