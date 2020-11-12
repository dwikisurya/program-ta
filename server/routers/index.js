const router = require('express').Router()
const authRoutes = require('./auth')
const sdmRoutes = require('./sdmanusia')
const sdbRoutes = require('./sdbarang')
const kegiatanproyek = require('./kegiatanproyek')
const kategoriproyek = require('./kategoriproyek')

router.get('/', (req, res) => {
    res.send(`homepage`)
})

router.use('/auth', authRoutes)
router.use('/sdmanusia', sdmRoutes)
router.use('/sdbarang', sdbRoutes)
router.use('/kegiatanproyek', kegiatanproyek)
router.use('/kategoriproyek', kategoriproyek)

module.exports = router