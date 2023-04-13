const express = require('express')
const {
  getPage,
  addPage,
  deletePage,
  getPages,
  updatePage,
} = require('../controllers/pages')
const advancedResults = require('../middleware/advancedResults')
const asyncHandler = require('../middleware/async')
const Page = require('../models/Page')
const ErrorResponse = require('../utils/errorResponse')

const router = express.Router()

// check for secretkey
const checkSecretKey = asyncHandler(async (req, res, next) => {
  if (process.env.SUPER_SECRET_KEY !== req.query.secretkey) {
    return next(new ErrorResponse('Invalid secretkey', 404))
  }
  next()
})

// assing the Role model to req object
router.all('*', async (req, res, next) => {
  req.model = Page
  next()
})

router.route('/').get(advancedResults(), getPages).post(checkSecretKey, addPage)

router
  .param('id', async (req, res, next, id) => {
    const page = await Page.findById(id)
    if (!page) {
      return next(new ErrorResponse(`No page with the id of ${id}`), 404)
    }
    next()
  })
  .route('/:id')
  .get(getPage)
  .put(checkSecretKey, updatePage)
  .delete(checkSecretKey, deletePage)

module.exports = router
