const express = require('express')
const { getCompany, updateCompany } = require('../controllers/company')
const router = express.Router({ mergeParams: true })
const { authorize } = require('../middleware/auth')
const CompanySchema = require('../models/Company')

// assing the model to req object
router.all('*', async (req, res, next) => {
  const Modal = await req.userDB.model('Company', CompanySchema)
  req.model = Modal
  next()
})

router.route('/').get(getCompany)
// ============
router.use(authorize(102))
router.route('/:id').put(updateCompany)

module.exports = router
