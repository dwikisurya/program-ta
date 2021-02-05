const mongoose = require('mongoose')
const Schema = mongoose.Schema

const biayarroleSchema = new Schema({
    namaRole: {
        type: String,
        required: true
    },
    hargaBiaya: {
        type: Number
    },
    created_at: Date,
    updated_at: Date,
})

const biayaRole = mongoose.model('biayaRole', biayarroleSchema)
module.exports = biayaRole