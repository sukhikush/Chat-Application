import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

import path from 'path'
import { fileURLToPath } from 'url'

import { Redis } from 'ioredis'
import { createAdapter } from '@socket.io/redis-adapter'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PORT = process.env.PORT || 3000

const app = express()
const httpServer = createServer(app)
httpServer.listen(PORT)

const pubClient = new Redis({
  host: 'redis-16875.c259.us-central1-2.gce.cloud.redislabs.com',
  port: 16875,
  password: 'SLst6VKz4u06T5ROxB7s7tEdipyGCfZ0'
})

const subClient = pubClient.duplicate()

pubClient.set('Server1', 'Sukhi-Test-1', (err, reply) => {
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

//Server 1 File.....

console.log('Server 11111111')

io.on('connection', socket => {
  console.log(`User ${socket.id} connected - root`)

  // socket.on('S1', async data => {
  //   console.log(`${data}`)
  //   io.emit('C2', `S1 - ${socket.id.substring(0, 5)} : ${data}`)
  // })

  // //Listin to client and Emit to client
  // socket.on('C1', async data => {
  //   console.log(`${data}`)
  //   io.emit('C1', `S1 - ${socket.id.substring(0, 5)} : ${data}`)
  // })

  console.log(socket.adapter.sids)
  console.log(socket.client.id)

  socket.on('Server', async (data, callback) => {
    console.log(data)
    var Receiver = data.To
    io.emit(Receiver, `S1 - ${socket.id.substring(0, 5)} : ${data.Mess}`)
    callback({
      status: `Mess Sent To ${Receiver}`
    })
  })
})

// var t = await client.set('Sukhi-Test', 'DataSukhi');
// const value = await client.get('Sukhi-Test');
// console.log(value);
