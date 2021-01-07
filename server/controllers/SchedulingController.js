const scheduling = require('../models/scheduling')
const { json } = require('body-parser')
const jwt = require('jsonwebtoken')

module.exports = class SchedulingController {

    static tambah(req, res) {

        const idRabProyek = req.body.idRabProyek
        const schedarirequst = req.body.sch
        const idMandor = req.body.idMandor
        const created_at = Date.now()

        scheduling.create({
            idRabProyek: idRabProyek,
            sch: schedarirequst,
            idMandor: idMandor,
            created_at: created_at
        }).then((result) => {
            res.status(201).json({ msg: 'Data Berhasil Ditambah' })
            console.log(result)
        }).catch((err) => {
            res.status(500).json(err)
        })
    }

    static read(req, res) {
        scheduling.find()
            .populate({
                path: 'idRabProyek',
                model: 'rabproyek',
                select: 'namaProyek id',
                populate: {
                    path: 'idProyek',
                    model: 'proyek',
                    select: 'namaProyek -_id'
                }
            }).populate({
                path: 'idMandor',
                model: 'sdManusia',
                select: 'namaKaryawan -_id'
            })
            .then((result) => {
                res.status(200).json(result)
            }).catch((err) => {
                res.status(500).json(err)
            })

    }

    static readOne(req, res) {
        const id = req.params.id
        scheduling.findOne(id)
            .exec()
            .then((result) => {
                res.status(200).json(result)
                console.log
            }).catch((err) => {
                res.status(500).json(err)
            })
    }

    static update(req, res) {

    }

    static delete(req, res) {
        const id = req.params.id

        scheduling.findByIdAndDelete(id)
            .exec()
            .then((result) => {
                res.status(303).json({ msg: 'Data Berhasil Dihapus' })
            }).catch((err) => {
                res.status(500).json(err)
            })
    }
}