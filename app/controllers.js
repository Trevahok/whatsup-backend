import { Room, Message, RoomValidationSchema } from './models.js'
import { User } from '../auth/models.js'

export var detailRoomController = async (req, res) => {
    try {
        var roomid = req.params.id;
        if( !roomid.match(/^[0-9a-fA-F]{24}$/) ) 
        return res.status(402).json({ errors: ['Invalid Room ID format.'] })
        const instance = await Room.findOne({ _id: roomid }, 'participants createdAt name').populate({path: 'participants', model:"User", select: "name"})
        if (!instance) return res.status(404).json({ errors: ['No such room found.'] })

        res.json(instance || {})
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
}
export var listMessageController = async (req, res) => {
    try {
        var roomid = req.params.id;
        const instance = await Room.findOne({ _id: roomid }, 'messages').populate('messages')
        res.json(instance || {})
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
}


export var listRoomController = async (req, res) => {
    // List the rooms the user is part of 
    try {
        var userid = req.user._id
        var user = await User.findOne({ _id: userid })
            .populate({ path: 'rooms', select: 'name participants', populate: { path: 'participants', model: 'User', select: 'name' } })
        if (!user) return res.status(401).json({ errors: ['Unauthorised access: User does not exist'] })
        const instances = user.rooms
        res.json(instances)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }

}

export var joinRoomController = async (req, res) => {
    try {
        var userid = req.user._id
        var roomid = req.params.id

        var room = await Room.findOne({ _id: roomid })
        if (!room) return res.status(404)

        var user = await User.findOne({ _id: userid })
        if (!user) return res.status(401).json({ errors: ['Unauthorised access: User does not exist'] })

        if (!user.rooms.includes(room._id)) {
            user.rooms.push(room)
            room.participants.push(userid)
            await Promise.all([room.save(), user.save()])
        }
        res.json({ room: room })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }

}

export var leaveRoomController = async (req, res) => {
    try {
        var userid = req.user._id
        var roomid = req.params.id

        var room = await Room.findOne({ _id: roomid })
        if (!room) return res.status(404)

        var user = await User.findOne({ _id: userid })
        if (!user) return res.status(401).json({ errors: ['Unauthorised access: User does not exist'] })

        room.participants.pull(user._id)
        user.rooms.pull(room._id)
        if (room.participants.length === 0) {
            await Message.deleteMany( { _id: { $in: room.messages } },)
            await room.remove()
        }
        else
            await room.save()

        await user.save()
        res.json({ room: room })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }

}

export var listRoomParticipantsController = async (req, res) => {
    try {
        var roomid = req.params.id

        var room = await Room.findOne({ _id: roomid })
        if (!room) return res.status(404)

        return { participants: room.participants }


    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }

}

export var createRoomController = async (req, res) => {
    try {

        const { error, value } = await RoomValidationSchema.validate(req.body, { abortEarly: false })
        if (error) return res.status(400).json({ errors: error.details.map(e => e.message) })

        var userid = req.user._id
        var user = await User.findOne({ _id: userid })
        const object = new Room({
            ...value,
            participants: [user]
        })

        var instance = await object.save()
        await user.save()
        user.rooms.push(instance.toObject())
        await user.save()
        res.status(201).json(instance)

    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }

}

