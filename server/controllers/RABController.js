const rabproyek = require('../models/rabproyek')
const { json } = require('body-parser')
const jwt = require('jsonwebtoken')

module.exports = class RABController {

    // Tambah Data
    static tambah(req, res) {
        const idproyek = req.body.idProyek
        const rabdarirequst = req.body.rab

        rabproyek.create({
            idProyek: idproyek,
            rab: rabdarirequst
        }).then((result) => {
            res.status(201).json({ msg: 'Data Berhasil Ditambah' })
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
                select: 'namaKegiatan'
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
                select: 'namaKegiatan'
            })
            .then((result) => {
                res.status(200).json(result)
            }).catch((err) => {
                res.status(500).json(err)
            })
    }

}