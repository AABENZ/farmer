const mongoose = require('mongoose')
const Schema = mongoose.Schema;

//create userSchema
const userSchema = Schema(
    {
        _id:mongoose.Schema.Types.ObjectId,
        name:{
            type: String,
            required: [true, 'name field is required']
        },

        email:{
            type: String,
            required: [true, 'email field is required'],
            unique: true,
            match:/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
            lowercase: true,
        },

        password:{
            type: String,
            required: [true, 'password field is required'],
        },


        status:{type:Number, default:1},
    }
)

module.exports = mongoose.model('User', userSchema)