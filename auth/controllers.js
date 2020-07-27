import { UserRegisterValidationSchema, UserLoginValidationSchema, User } from "./models.js";
import jwt from 'jsonwebtoken'

export var registerController = async (req, res) => {

    try {
        const { error } = await UserRegisterValidationSchema.validate(req.body )
        if (error) throw { error: error.details[0].message }

        const emailExists = await User.findOne({ email: req.body.email })
        if (emailExists) return  res.status(401).json({ errors: ["Email already exists."] }).status(401)

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        })

        var instance = await user.save()
        res.json({  id: instance._id })
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }

}

export var loginController = async (req, res) => {
    try {
        const { err } = await UserLoginValidationSchema.validate(req.body ,{ abortEarly: false } )
        if (err) return res.status(401).json({ errors: err }).status(401)

        const user = await User.findOne({ email: req.body.email })
        if (!user) return res.status(401).json({ errors:[ "No such user exists."] }).status(401)

        const validpass = await user.passwordMatches(req.body.password)
        if (!validpass) return  res.status(401).json({ errors:[ "Please enter the correct password."] }).status(401)


        const token = jwt.sign({ id: user._id  , name: user.name }, process.env.SECRET_KEY)
        return res.header('Authorization', token).status(200).json({ token: token })

    } catch (err) {

        console.log(err)
        res.sendStatus(500)

    }
}