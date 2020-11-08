const router = require('express').Router()
const authRoutes = require('./auth')

router.get('/', (req, res) => {
    res.send(`homepage`)
})

router.use('/auth', authRoutes)

module.exports = router