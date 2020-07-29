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

const MessageSchema = mongoose.Schema({
    data: String,
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

const RoomSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' , required:true},
    messages: [MessageSchema],
    participants: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ]
}, { timestamps: true });

export let Room = mongoose.model('Room', RoomSchema)
export let Message = mongoose.model('Message', MessageSchema)