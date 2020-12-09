const rabproyek = require('../models/rabproyek')
const { json } = require('body-parser')
const jwt = require('jsonwebtoken')
const { update } = require('../models/rabproyek')

module.exports = class RABController {

    // Tambah Data
    static tambah(req, res) {
        const idproyek = req.body.idProyek
        const rabdarirequst = req.body.rab
        const grand = req.body.grandTotal
        const updated_at = Date.now()
        const status = "Created"

        rabproyek.create({
            idProyek: idproyek,
            rab: rabdarirequst,
            updated_at: updated_at,
            status: status,
            grandTotal: grand
        }).then((result) => {
            res.status(201).json({ msg: 'Data Berhasil Ditambah' })
            console.log(result)
        }).catch((err) => {
            res.status(500).json(err)
        })
    }

    // Read Data
    static read(req, res) {

        rabproyek.find()
            .populate({
                path: 'idProyek',
                select: 'namaProyek'
            }).populate({
                path: 'rab.idKegiatanProyek',
                select: 'namaKegiatan-_id'
            })
            .then((result) => {
                res.status(200).json(result)
            }).catch((err) => {
                res.status(500).json(err)
            })

    }

    // Delete Data

    static delete(req, res) {
        const id = req.params.id

        rabproyek.findByIdAndDelete(id)
            .exec()
            .then((result) => {
                res.status(303).json({ msg: 'Data Berhasil Dihapus' })
            }).catch((err) => {
                res.status(500).json(err)
            })
    }

    // Read One
    static readOne(req, res) {
        const id = req.params.id
        rabproyek.findById(id)
            .populate({
                path: 'idProyek',
                select: 'namaProyek'
            }).populate({
                path: 'idKegiatanProyek',
                select: 'namaKegiatan -_id'
            })
            .then((result) => {
                res.status(200).json(result)
            }).catch((err) => {
                res.status(500).json(err)
            })
    }

    // Put
    static put(req, res) {
        const id = req.params.id
        const updated_at = Date.now()


        const dataupdate = {
            idProyek: req.body.idProyek,
            rab: req.body.rab,
            updated_at: updated_at
        }

        rabproyek.findByIdAndUpdate(id, dataupdate, { new: true }, function (err, docs) {
            if (err) {
                res.status(500).send(err)
                console.log(dataupdate)
            } else {
                res.status(200).send(docs)
            }
        })

    }
}