const { send } = require('process')
const router = require('.')

const sdRouter = require('express').Router()
const SDBController = require('../controllers/SDBController')
const Authentication = require('../middlewares/authentication')

/*
Router.get / .post / .delete / .patch / .put
*/

sdRouter.post('/tambah', SDBController.tambah)
sdRouter.delete('/:id', SDBController.delete)
sdRouter.put('/:id', SDBController.update)
sdRouter.get('/', SDBController.read)
sdRouter.get('/:id', SDBController.readOne)


module.exports = sdRouter