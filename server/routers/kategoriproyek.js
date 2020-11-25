
const { send } = require('process')
const router = require('.')

const kategoriproyek = require('express').Router()
const KategoriController = require('../controllers/KategoriController')
const Authentication = require('../middlewares/authentication')

/*
Router.get / .post / .delete / .patch / .put

*/
kategoriproyek.post('/tambah', KategoriController.tambah)
kategoriproyek.delete('/:id', KategoriController.delete)
kategoriproyek.put('/:id', KategoriController.update)
kategoriproyek.get('/', KategoriController.read)
kategoriproyek.get('/:id', KategoriController.readOne)

module.exports = kategoriproyek