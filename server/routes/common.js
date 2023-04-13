const express = require('express')
const router = express.Router({ mergeParams: true })
const { getLocation } = require('../controllers/common')

// ============== GET Location
router.route('/getlocation').get(getLocation)

module.exports = router
