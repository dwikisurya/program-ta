module.exports = function (req, res, next) {
    console.log('halo ini proses auth')
    const isLoggedIn = false

    if (isLoggedIn) {
        next()
    } else {
        res.status(403).json()
    }

}