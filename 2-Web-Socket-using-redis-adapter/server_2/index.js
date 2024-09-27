import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

import path from 'path'
import { fileURLToPath } from 'url'

import { Redis } from 'ioredis'
import { createAdapter } from '@socket.io/redis-adapter'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PORT = process.env.PORT || 4000

const app = express()
const httpServer = createServer(app)
httpServer.listen(PORT)

const pubClient = new Redis({
  host: 'redis-16875.c259.us-central1-2.gce.cloud.redislabs.com',
  port: 16875,
  password: 'SLst6VKz4u06T5ROxB7s7tEdipyGCfZ0'
})

const subClient = pubClient.duplicate()

pubClient.set('Server2', 'Sukhi-Test-2', (err, reply) => {
  if (err) {
    console.error('Error setting key:', err)
  } else {
    console.log('Key set successfully:', reply)
  }
})

const io = new Server(httpServer, {
  adapter: createAdapter(pubClient, subClient)
})

app.use(express.static(path.join(__dirname, 'public')))

console.log('Server 22222222')

io.on('connection', socket => {
  console.log(`User ${socket.id} connected - roote`)
  // console.log(socket.adapter.sids)
  //   socket.on('S2', data => {
  //     console.log(data)
  //     // io.emit('C2', ` S2 - ${socket.id.substring(0, 5)}: ${data}`)
  //     io.emit('C1', `S2 - ${socket.id.substring(0, 5)} : ${data}`)
  //   })

  //   socket.on('C2', async data => {
  //     console.log(`${data}`)
  //     io.emit('C2', `S1 - ${socket.id.substring(0, 5)} : ${data}`)
  //   })

  socket.on('Server', async (data, callback) => {
    console.log(data)
    var Receiver = data.To
    io.emit(Receiver, `S1 - ${socket.id.substring(0, 5)} : ${data.Mess}`)
    callback({
      status: `Mess Sent To ${Receiver}`
    })
  })
})
