import mongoose from 'mongoose'
import Joi from '@hapi/joi'

export const MessageValidationSchema = Joi.object({
    data: Joi.string().required(),
    from: Joi.string().required()
})
export const RoomValidationSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    messages: Joi.array().items(MessageValidationSchema).optional()
})
var MessageSchema = mongoose.Schema({
    data: String,
    from: String, 
}, { timestamps: true })

var RoomSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    messages: [MessageSchema],
    participants: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ]
}, { timestamps: true });


export let Room = mongoose.model('Room', RoomSchema)
export let Message = mongoose.model('Message', MessageSchema)