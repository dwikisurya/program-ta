const sdBarang = require('../models/sdBarang')
const { json } = require('body-parser')
const jwt = require('jsonwebtoken')

module.exports = class SDBController {

    // Tambah data
    static tambah(req, res) {
        const namaBarang = req.body.namaBarang
        const satuanBarang = req.body.satuanBarang
        const updated_at = Date.now()

        sdBarang.create({
            namaBarang: namaBarang,
            satuanBarang: satuanBarang,
            updated_at: updated_at

        }).then((result) => {
            res.status(201).json({msg: 'Data Berhasil Ditambah'})
        }).catch((err) => {
            res.status(500).json(err)
        })
    }

    // Delete data, dapat dari _id
    static delete(req, res) {
        const id = req.body.id

        sdBarang.findByIdAndDelete({
            _id: id
        }).then((result) => {
            res.status(303).json({ msg: 'Data Berhasil Dihapus' })
        }).catch((err) => {
            res.status(500).json(err)
        })
    }

    // Note: waktu buat halaman untuk update, sertakan data yang ada di kolomnya
    static update(req, res) {
        const id = req.body.id
        const updated_at = Date.now()

        const dataupdate = {
            namaBarang: req.body.namaBarang,
            satuanBarang: req.body.satuanBarang,
            updated_at: updated_at
        }

        sdBarang.findByIdAndUpdate(id, dataupdate, { new: true }, function (err, docs) {
            if (err) {
                console.log(err)
                res.status(500).send(err);
            }
            else {
                console.log("success");
                res.send(docs)
            }
        })
    }

    // Baca semua data
    static read(req, res) {

        sdBarang.find({

        }).then((result) => {
            res.status(201).json(result)
        }).catch((err) => {
            res.status(500).json(err)
        })
    }

}

