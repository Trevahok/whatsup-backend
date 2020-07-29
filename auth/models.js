import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'


import Joi from "@hapi/joi";

export const UserRegisterValidationSchema = Joi.object( {
    name: Joi.string().min(6).max(255).required(true),
    email: Joi.string().email().max(255).required(true),
    password: Joi.string().required().min(8).max(1024),
})

export const UserLoginValidationSchema = Joi.object({
    email: Joi.string().min(6).max(255).required(true).email(),
    password: Joi.string().min(8).max(1024).required(true),
})


export const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
    },
    email: {
        type: String,
        required: true,
        min: 3 ,
        max: 100
    },
    password: {
        type: String,
        required: true,
        max : 1024,
        min: 8
    },
    date: {
        type: Date,
        default: Date.now
    },
    role:{
        type:String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'

    },
    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }]

})


UserSchema.pre('save', async function (next)  {
    var user = this;

    //If the password has not been modified in this save operation, leave it alone (So we don't double hash it)
    if (!user.isModified('password')) {
        next();
        return;
    }
    const hashedPwd = await new Promise((resolve, reject) => {
        bcrypt.hash(user.password, 11 , function(err, hash) {
          if (err) reject(err)
          resolve(hash)
        });
      })

    //Replace the plaintext pw with the Hash+Salted pw;
    user.password = hashedPwd;

    //Continue with the save operation
    next();
});

UserSchema.methods.passwordMatches = async function (plainText)  {
    var user = this;
    return await bcrypt.compare(plainText, user.password);
};



export let User = mongoose.model('User', UserSchema)