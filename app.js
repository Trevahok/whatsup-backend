import express from 'express'
import dotenv from "dotenv"
import morgan from 'morgan'
import cors from 'cors'
import socket from 'socket.io'
import mongoose from 'mongoose'

import authRouter from './auth/routes.js'
import socketioJwt from 'socketio-jwt'


dotenv.config()

mongoose.connect( 
    process.env.DB_URL , 
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    },
    ()=>{
        console.log('db is connected')
    }
)


const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static("public"));


app.use('/user', authRouter )

app.use((req, res, next) => {
    return res.status(404).send({ errors: ['This Route ' + req.url + ' Not found.' ] });
});

const server = app.listen(process.env.PORT || 8000)

const io = socket(server)

var connections = {} 

io.on('connection', socketioJwt.authorize({
    secret: process.env.SECRET_KEY,
    timeout: 15000 // 15 seconds to send the authentication message
  }))
  .on('authenticated', (socket) => {
    //this socket is authenticated, we are good to handle more events from it.
    var id = socket.decoded_token.id
    console.log(`hello! ${socket.decoded_token.name}`)
    connections[id]  = socket

  });
