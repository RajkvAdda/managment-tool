const express = require('express')
const {
  addDesignation,
  deleteDesignation,
  deleteManyDesignations,
  getDesignation,
  getDesignations,
  updateDesignation,
} = require('../controllers/designations')
const advancedResults = require('../middleware/advancedResults')
const { authorize } = require('../middleware/auth')
const DesignationSchema = require('../models/Designation')
const ErrorResponse = require('../utils/errorResponse')

const router = express.Router()

// assing the Role model to req object
router.all('*', async (req, res, next) => {
  const Modal = await req.userDB.model('Designations', DesignationSchema)
  req.model = Modal
  next()
})

// handle authorization
router.use(authorize(105))

router
  .route('/')
  .get(advancedResults(), getDesignations)
  .post(addDesignation)
  .delete(deleteManyDesignations)

router
  .param('id', async (req, res, next, id) => {
    const designation = await req.model.findById(id)
    if (!designation) {
      return next(new ErrorResponse(`No designation with the id of ${id}`), 404)
    }
    next()
  })
  .route('/:id')
  .get(getDesignation)
  .put(updateDesignation)
  .delete(deleteDesignation)

module.exports = router
