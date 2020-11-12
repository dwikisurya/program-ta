const sdManusia = require('../models/sdManusia')
const { json } = require('body-parser')
const jwt = require('jsonwebtoken')

module.exports = class SDMController {

    // Tambah data
    static tambah(req, res) {
        const namaKaryawan = req.body.namakaryawan
        const tgl_lahir = req.body.tgl_lahir
        const jk = req.body.jk
        const alamat = req.body.alamat
        const no_telp = req.body.notelp

        sdManusia.create({
            namaKaryawan: namaKaryawan,
            tgl_lahir: tgl_lahir,
            jk: jk,
            alamat: alamat,
            no_telp: no_telp,
        }).then((result) => {
            res.status(201).json(result)
        }).catch((err) => {
            res.status(500).json(err)
        })
    }

    // Delete data , dapat dari _id
    static delete(req, res) {
        const id = req.body.id

        sdManusia.findByIdAndDelete({
            _id: id
        }).then((result) => {
            res.status(303).json({ msg: 'Data Berhasil Dihapus' })
        }).catch((err) => {
            res.status(500).json(err)
        })
    }

    // Update data , dari _id
    static update(req, res) {
        const id = req.body.id

        const dataupdate = {
            namaKaryawan: req.body.namakaryawan,
            tgl_lahir: req.body.tgl_lahir,
            jk: req.body.jk,
            alamat: req.body.alamat,
            no_telp: req.body.notelp
        }


        sdManusia.findByIdAndUpdate(id, dataupdate, { new: true }, function (err, docs) {
            if (err) {
                res.status(500).send(err);
            }
            else {
                res.status(200).send(docs)
            }
        })
    }

    // Baca Semua Data
    static read(req, res) {

        sdManusia.find({

        }).then((result) => {
            res.status(200).json(result)
        }).catch((err) => {
            res.status(500).json(err)
        })
    }

}