import { Room , Message } from './models'

export var listRoomController = async (req, res) => {
    try {
        const instances = await Room.find(req.query)
        res.json(instances)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
}

export var createRoomController = async (req, res) => {
    try {

        const object = new Room({
            ...value
        })

        var instance = await object.save()
        res.json(instance).status(201)

    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
}

