const rabproyek = require('../models/rabproyek')
const { json } = require('body-parser')
const jwt = require('jsonwebtoken')
const { update } = require('../models/rabproyek')
const { createInvoice } = require("./ExportLaporan.js")

module.exports = class RABController {

    // Tambah Data
    static tambah(req, res) {
        const idproyek = req.body.idProyek
        const rabdarirequst = req.body.rab
        const grand = req.body.grandTotal
        const updated_at = Date.now()
        const status = "Created"
        const created_at = Date.now()
        const posted_by = req.body.posted_by
        const inputsdm = req.body.idSDM
        const inputsdb = req.body.idSDB
        const inputworkhour = req.body.workhourSDM
        const inputpcs = req.body.pcsSDB

        rabproyek.create({
            idProyek: idproyek,
            rab: rabdarirequst,
            status: status,
            grandTotal: grand,
            updated_at: updated_at,
            created_at: created_at,
            posted_by: posted_by,
            idSDM: inputsdm,
            idSDB: inputsdb,
            workhourSDM: inputworkhour,
            pcsSDB: inputpcs
        }).then((result) => {
            res.status(201).json({ msg: 'Data Berhasil Ditambah' })
            console.log(result)
        }).catch((err) => {
            res.status(500).json(err)
            console.log(err)
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
            }).populate({
                path: 'idSDB',
                select: 'namaBarang-_id'
            })
            .populate({
                path: 'idSDM',
                select: 'namaKaryawan-_id'
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
                select: 'namaProyek -_id'
            }).populate({
                path: 'rab.idKegiatanProyek',
                select: 'namaKegiatan'
            })
            .then((result) => {
                const hasil = result
                createInvoice(hasil, `./report/rab_` + hasil._id + `.pdf`)
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

    static updateStatus(req, res) {
        const id = req.params.id
        const status = req.body.status
        const updated_at = Date.now()

        const dataupdate = {
            status: status,
            updated_at: updated_at
        }

        rabproyek.findByIdAndUpdate(id, dataupdate, { new: true }, function (err, docs) {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(200).send(docs)
                console.log(id, status)
            }
        })
    }
}