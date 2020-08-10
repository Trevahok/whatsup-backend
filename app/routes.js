import express from 'express'
import { createRoomController, listMessageController, detailRoomController, listRoomController, joinRoomController, leaveRoomController} from './controllers.js'

const appRouter = express.Router()

appRouter.get('/:id' , detailRoomController)
appRouter.get('/:id/messages' , listMessageController)
appRouter.post('/' , createRoomController )
appRouter.get('/', listRoomController)
appRouter.post('/:id/participants', joinRoomController)
appRouter.delete('/:id/participants', leaveRoomController)

export default appRouter

