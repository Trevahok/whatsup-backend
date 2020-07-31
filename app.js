import express from 'express'
import dotenv from "dotenv"
import morgan from 'morgan'
import cors from 'cors'
import socket from 'socket.io'
import mongoose from 'mongoose'

import authRouter from './auth/routes.js'
import socketioJwt from 'socketio-jwt'
import appRouter from './app/routes.js'
import { loginRequiredMiddleware } from './auth/middlewares.js'
import { Room, RoomValidationSchema, Message } from './app/models.js'


dotenv.config()

mongoose.connect(
    process.env.DB_URL,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    },
    () => {
        console.log('db is connected')
    }
)

const app = express()

app.use(cors({origin: '*'}))
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static("public"));


app.use('/user', authRouter)
app.use('/room',  loginRequiredMiddleware  , appRouter)

app.use((req, res, next) => {
    return res.status(404).send({ errors: ['This Route ' + req.url + ' Not found.'] });
});

const server = app.listen(process.env.PORT || 8000, '0.0.0.0')

const io = socket(server)


io.on('connect', (socket) => {
    socket.on('joinRoom' , (data)=>{
        console.log('joining ' , socket.id, ' to room: ', data.room)
        socket.join(data.room)
    })
    socket.on('leaveRoom' , (data) =>{
        console.log('leaving ' , socket.id, ' from room: ', data.room)
        socket.leave(data.room)

    })
    socket.on('message' , async (data)=>{
        try {
            
            var [ room , message] = await Promise.all( [Room.findOne({_id: data.roomId}), new Message({data: data.message, from: data.from.name}).save() ] )
            room.messages.push(message)
            room.save()
            io.to(data.roomId).emit('message', message)
        } catch (error) {
            console.log(error)
            
        }
    })
});


