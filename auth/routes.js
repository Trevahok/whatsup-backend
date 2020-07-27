import express from 'express'
import { registerController, loginController } from './controllers.js'

const authRouter =  express.Router()

authRouter.post('/register', registerController )

authRouter.post('/login', loginController )

export default authRouter