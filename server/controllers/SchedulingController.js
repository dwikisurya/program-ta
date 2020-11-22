const scheduling = require('../models/scheduling')
const { json } = require('body-parser')
const jwt = require('jsonwebtoken')

module.exports = class SchedulingController {

    static tambah(req, res) {

        const idRabProyek = req.body.idRabProyek
        const schedarirequst = req.body.sch

        scheduling.create({
            idRabProyek: idRabProyek,
            sch: schedarirequst
        }).then((result) => {
            res.status(201).json({ msg: 'Data Berhasil Ditambah' })
            console.log(sche)
        }).catch((err) => {
            res.status(500).json(err)
        })
    }

    static read(req, res) {
        scheduling.find()
            .populate({
                path: 'sch.idKegiatanRab',
                select: 'uraianPekerjaan'
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