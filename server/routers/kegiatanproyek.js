const { send } = require('process')
const router = require('.')

const kegiatanproyek = require('express').Router()
const KegiatanController = require('../controllers/KegiatanController')
const Authentication = require('../middlewares/authentication')

/*
Router.get / .post / .delete / .patch / .put

*/
kegiatanproyek.post('/tambah', KegiatanController.tambah)
kegiatanproyek.delete('/:id', KegiatanController.delete)
kegiatanproyek.put('/', KegiatanController.update)
kegiatanproyek.get('/', KegiatanController.read)
kegiatanproyek.get('/:id', KegiatanController.readOne)

module.exports = kegiatanproyek