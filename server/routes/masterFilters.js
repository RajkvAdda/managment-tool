const express = require('express')
const {
  addMasterFilter,
  deleteManyMasterFilters,
  deleteMasterFilter,
  getMasterFilter,
  getMasterFilters,
  updateMasterFilter,
} = require('../controllers/masterFilters')
const advancedResults = require('../middleware/advancedResults')
const { authorize } = require('../middleware/auth')
const MasterFilterSchema = require('../models/MasterFilter')
const ErrorResponse = require('../utils/errorResponse')

const router = express.Router()

// assing model to req object
router.all('*', async (req, res, next) => {
  const Modal = await req.userDB.model('MasterFilters', MasterFilterSchema)
  req.model = Modal
  next()
})

// handle authorization
router.use(authorize(104))

router
  .route('/')
  .get(advancedResults(), getMasterFilters)
  .post(addMasterFilter)
  .delete(deleteManyMasterFilters)

router
  .param('id', async (req, res, next, id) => {
    const role = await req.model.findById(id)
    if (!role) {
      return next(new ErrorResponse(`No filter with the id of ${id}`), 404)
    }
    next()
  })
  .route('/:id')
  .get(getMasterFilter)
  .put(updateMasterFilter)
  .delete(deleteMasterFilter)

module.exports = router
