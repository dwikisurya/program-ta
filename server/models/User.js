const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true

    },
    password: {
        type: String,
        minlength: 6
    },
    fullName: String,
    isWoman: Boolean,
})

userSchema.pre('save', async function (next) {
    const hashedPassword = bcrypt.hashSync(this.password, 10)
    this.password = hashedPassword
    next()
})

const User = mongoose.model('User', userSchema)
module.exports = User