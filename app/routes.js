import express from 'express'
import { createRoomController, detailRoomController, listRoomController } from './controllers.js'

const appRouter = express.Router()

appRouter.get('/:id' , detailRoomController)
appRouter.post('/' , createRoomController )
appRouter.get('/', listRoomController)

export default appRouter

