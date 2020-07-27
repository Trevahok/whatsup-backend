import mongoose from 'mongoose'
import Joi from '@hapi/joi'



const MessageSchema = mongoose.Schema({
    type: String,
    timestamp: Date,
    delivered: Boolean,
    read: Boolean
})

const RoomSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    messages: [ MessageSchema ],
    participants:[
        { type: Schema.Types.ObjectId, ref: 'User' }
    ]
},{ timestamps : true});

export let Room = mongoose.model('Room', RoomSchema)
export let Message = mongoose.model('Message', MessageSchema)