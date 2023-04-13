const { ErrorResponse } = require('@remix-run/router')
const asyncHandler = require('../middleware/async')

// @desc      Get masterFilters
// @route     GET /api/v1/masterFilter
// @access    Private
exports.getMasterFilters = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

// @desc      Get single masterFilter
// @route     GET /api/v1/masterFilters/:id
// @access    Private
exports.getMasterFilter = asyncHandler(async (req, res, next) => {
  const masterFilter = await req.model.findById(req.params.id)
  res.status(200).json({
    success: true,
    data: masterFilter,
  })
})

// @desc      Add masterFilter
// @route     POST /api/v1/masterFilters
// @access    Private
exports.addMasterFilter = asyncHandler(async (req, res, next) => {
  // ckeck for id
  if (req.body?._id) {
    req.method = 'PUT'
    req.url = `/api/v1/masterFilters/${req.body._id}`
    req.app.handle(req, res, next)
  } else {
    const masterFilter = await req.model.create({ ...req.body, ...req.common })
    res.status(201).json({
      success: true,
      data: masterFilter,
    })
  }
})

// @desc      Update masterFilter
// @route     PUT /api/v1/masterFilters/:id
// @access    Private
exports.updateMasterFilter = asyncHandler(async (req, res, next) => {
  const masterFilter = await req.model.findByIdAndUpdate(
    req.params.id,
    { ...req.body, ...req.common },
    {
      new: true,
      runValidators: true,
    }
  )

  res.status(200).json({
    success: true,
    data: masterFilter,
  })
})

// @desc      Delete masterFilter
// @route     DELETE /api/v1/masterFilters/:id
// @access    Private
exports.deleteMasterFilter = asyncHandler(async (req, res, next) => {
  await req.model.findByIdAndDelete(req.params.id)
  res.status(200).json({
    success: true,
    data: {},
  })
})

// @desc      Delete masterFilter
// @route     DELETE /api/v1/masterFilters
// @access    Private
exports.deleteManyMasterFilters = asyncHandler(async (req, res, next) => {
  if (!Array.isArray(req.body)) {
    return next(new ErrorResponse('Bad Request, we expect array of ids', 400))
  }
  await req.model.deleteMany({ _id: { $in: req.body } })
  res.status(200).json({
    success: true,
    data: {},
  })
})
