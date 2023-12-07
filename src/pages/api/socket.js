import { Server } from 'socket.io'

export default function SocketHandler(req, res) {

  if (global.io) {

    global.io.on('connect', (socket) => {
      console.log(`${socket.id} connected`)

      socket.on('message', (message) => {

        global.io.emit('message', `${socket.id} said ${message}`)

      })

      socket.on('disconnect', () => {

        console.log(`${socket.id} disconnected`)

      })

    })

  }
  else {

    console.log('Socket is initializing...')

    global.io = new Server(res.socket.server)

    console.log('Socket initialized!')

  }

  res.end()
}