const { send } = require('process')
const router = require('.')

const schRouter = require('express').Router()
const SchedullingController = require('../controllers/SchedulingController')
const Authentication = require('../middlewares/authentication')

/*
Router.get / .post / .delete / .patch / .put

*/
schRouter.post('/tambah', SchedullingController.tambah)
schRouter.get('/', SchedullingController.read)
schRouter.delete('/:id', SchedullingController.delete)
schRouter.get('/:id', SchedullingController.readOne)


module.exports = schRouter