const router = require('express').Router()
const authRoutes = require('./auth')
const sdmRoutes = require('./sdmanusia')
const sdbRoutes = require('./sdbarang')
const kegiatanproyek = require('./kegiatanproyek')
const kategoriproyek = require('./kategoriproyek')
const proyek = require('./proyek')
const rabproyek = require('./rab')
const scheduling = require('./scheduling')
const perkembangan = require('./perkembanganproyek')
const pelaporantrouble = require('./pelaporantrouble')

router.get('/', (req, res) => {
    res.send('homepage')
})

router.use('/auth', authRoutes)
router.use('/sdmanusia', sdmRoutes)
router.use('/sdbarang', sdbRoutes)
router.use('/kegiatanproyek', kegiatanproyek)
router.use('/kategoriproyek', kategoriproyek)
router.use('/proyek', proyek)
router.use('/rab', rabproyek)
router.use('/scheduling', scheduling)
router.use('/perkembangan', perkembangan)
router.use('/pelaporantrouble', pelaporantrouble)

module.exports = router