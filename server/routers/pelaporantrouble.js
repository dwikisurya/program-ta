const { send } = require('process')
const router = require('.')

const pelaporantrouble = require('express').Router()
const TroubleController = require('../controllers/TroubleController')


/*
Router.get / .post / .delete / .patch / .put

*/
pelaporantrouble.post('/tambah', TroubleController.tambah)
pelaporantrouble.get('/', TroubleController.read)

module.exports = pelaporantrouble