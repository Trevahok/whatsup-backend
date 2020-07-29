import { Room, Message, RoomValidationSchema } from './models.js'
import { User} from '../auth/models.js'

export var detailRoomController = async (req, res) => {
    try {
        var roomid = req.params.id;
        const instance = await Room.findOne({ _id: roomid })
        res.json(instance || {})
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
}

export var listRoomController = async ( req,  res) =>{
    // TODO: check if the userid from the token is valid and exists
    try {
        var userid = req.user.id
        var user = await User.findOne({ _id: userid } ).populate('rooms')
        const instances =  user.rooms
        res.json(instances)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }

}

export var joinRoomController = async (req, res) =>{
    try {
        var userid = req.user.id
        var user = await User.findOne({ _id: userid } ).populate('rooms')
        const instances =  user.rooms
        res.json(instances)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }

}

export var createRoomController = async (req, res) => {
    try {

        const { error, value } = await RoomValidationSchema.validate(req.body, { abortEarly: false })
        if (error) return res.status(400).json({ errors: error.details.map(e => e.message) })

        var userid = req.user.id
        var user = await User.findOne({ _id: userid } )
        const object = new Room({
            ...value,
            owner: user,
        })

        var instance = await object.save()
        user.rooms.push(instance)
        await user.save()
        res.status(201).json(instance)

    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }

}

