
const { send } = require('process')
const router = require('.')

const biayarole = require('express').Router()
const BiayaController = require('../controllers/BiayaController')
const biayaRole = require('../models/biayaRole')


/*
Router.get / .post / .delete / .patch / .put

*/
biayarole.post('/tambah', BiayaController.tambah)
biayarole.delete('/:id', BiayaController.delete)
biayarole.put('/:id', BiayaController.update)
biayarole.get('/', BiayaController.read)


module.exports = biayarole