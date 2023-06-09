const express = require('express')
const {
  login,
  logout,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth')

const router = express.Router()

// router.post('/register', register);
router.post('/login', login)
router.get('/logout', logout)
router.post('/forgotpassword', forgotPassword)
router.put('/resetpassword/:resettoken', resetPassword)

module.exports = router
