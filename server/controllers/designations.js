const { ErrorResponse } = require('@remix-run/router')
const asyncHandler = require('../middleware/async')

// @desc      Get Designations
// @route     GET /api/v1/designations
// @access    Private
exports.getDesignations = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

// @desc      Get single Designation
// @route     GET /api/v1/designations/:id
// @access    Private
exports.getDesignation = asyncHandler(async (req, res, next) => {
  const designation = await req.model.findById(req.params.id)
  res.status(200).json({
    success: true,
    data: designation,
  })
})

// @desc      Add Designation
// @route     POST /api/v1/designations
// @access    Private
exports.addDesignation = asyncHandler(async (req, res, next) => {
  // ckeck for id
  if (req.body?._id) {
    req.method = 'PUT'
    req.url = `/api/v1/designations/${req.body._id}`
    req.app.handle(req, res, next)
  } else {
    const designation = await req.model.create({ ...req.body, ...req.common })
    res.status(201).json({
      success: true,
      data: designation,
    })
  }
})

// @desc      Update Designation
// @route     PUT /api/v1/designations/:id
// @access    Private
exports.updateDesignation = asyncHandler(async (req, res, next) => {
  const designation = await req.model.findByIdAndUpdate(
    req.params.id,
    { ...req.body, ...req.common },
    {
      new: true,
      runValidators: true,
    }
  )

  res.status(200).json({
    success: true,
    data: designation,
  })
})

// @desc      Delete Designation
// @route     DELETE /api/v1/designations/:id
// @access    Private
exports.deleteDesignation = asyncHandler(async (req, res, next) => {
  await req.model.findByIdAndDelete(req.params.id)
  res.status(200).json({
    success: true,
    data: {},
  })
})

// @desc      Delete Designations
// @route     DELETE /api/v1/designations
// @access    Private
exports.deleteManyDesignations = asyncHandler(async (req, res, next) => {
  if (!Array.isArray(req.body)) {
    return next(new ErrorResponse('Bad Request, we expect array of ids', 400))
  }
  await req.model.deleteMany({ _id: { $in: req.body } })
  res.status(200).json({
    success: true,
    data: {},
  })
})
