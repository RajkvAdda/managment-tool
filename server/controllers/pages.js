const asyncHandler = require('../middleware/async')
const Page = require('../models/Page')

// @desc      Get pages
// @route     GET /api/v1/pages
// @access    Public
exports.getPages = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

// @desc      Get single page
// @route     GET /api/v1/pages/:id
// @access    Public
exports.getPage = asyncHandler(async (req, res, next) => {
  const page = await Page.findById(req.params.id)
  res.status(200).json({
    success: true,
    data: page,
  })
})

// @desc      Add page
// @route     POST /api/v1/pages
// @access    Private
exports.addPage = asyncHandler(async (req, res, next) => {
  let query
  // ckeck for id
  if (req.body?._id) {
    query = Page.findByIdAndUpdate(req.body?._id, req.body, {
      new: true,
      runValidators: true,
    })
  } else {
    query = Page.create(req.body)
  }
  const page = await query
  res.status(200).json({
    success: true,
    data: page,
  })
})

// @desc      Update page
// @route     PUT /api/v1/pages/:id
// @access    Private
exports.updatePage = asyncHandler(async (req, res, next) => {
  const page = await Page.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: page,
  })
})

// @desc      Delete page
// @route     DELETE /api/v1/pages/:id
// @access    Private
exports.deletePage = asyncHandler(async (req, res, next) => {
  await Page.findByIdAndDelete(req.params.id)
  res.status(200).json({
    success: true,
    data: {},
  })
})
