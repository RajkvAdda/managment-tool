const express = require('express')
const {
  addBranch,
  deleteBranch,
  getBranch,
  getBranches,
  updateBranch,
} = require('../controllers/branches')
const advancedResults = require('../middleware/advancedResults')
const { authorize } = require('../middleware/auth')
const BranchSchema = require('../models/Branch')
const ErrorResponse = require('../utils/errorResponse')

const router = express.Router()

// assing the Role model to req object
router.all('*', async (req, res, next) => {
  let Model = await req.userDB.model('Branches', BranchSchema)
  req.model = Model
  next()
})

router
  .route('/')
  .get(advancedResults(), getBranches)
  .post(authorize(103), addBranch)

router
  .param('id', async (req, res, next, id) => {
    const role = await req.model.findById(id)
    if (!role) {
      return next(new ErrorResponse(`No role with the id of ${id}`), 404)
    }
    next()
  })
  .route('/:id')
  .get(getBranch)
  .put(authorize(103), updateBranch)
  .delete(authorize(103), deleteBranch)

module.exports = router
