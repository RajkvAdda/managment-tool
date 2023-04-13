const asyncHandler = require('../middleware/async')

// @desc      Get branches
// @route     GET /api/v1/branches
// @access    Public
exports.getBranches = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

// @desc      Get single Branch
// @route     GET /api/v1/branches/:id
// @access    Public
exports.getBranch = asyncHandler(async (req, res, next) => {
  const branch = await req.model.findById(req.params.id)
  res.status(200).json({
    success: true,
    data: branch,
  })
})

// @desc      Add Branch
// @route     POST /api/v1/branches
// @access    Private
exports.addBranch = asyncHandler(async (req, res, next) => {
  // ckeck for id
  if (req.body?._id) {
    req.method = 'PUT'
    req.url = `/api/v1/branches/${req.body._id}`
    req.app.handle(req, res, next)
  } else {
    const branch = await req.model.create({ ...req.body, ...req.common })
    res.status(200).json({
      success: true,
      data: branch,
    })
  }
})

// @desc      Update Branch
// @route     PUT /api/v1/branches/:id
// @access    Private
exports.updateBranch = asyncHandler(async (req, res, next) => {
  const branch = await req.model.findByIdAndUpdate(
    req.params.id,
    { ...req.body, ...req.common },
    {
      new: true,
      runValidators: true,
    }
  )

  res.status(200).json({
    success: true,
    data: branch,
  })
})

// @desc      Delete Branch
// @route     DELETE /api/v1/branches/:id
// @access    Private
exports.deleteBranch = asyncHandler(async (req, res, next) => {
  await req.model.findByIdAndDelete(req.params.id)
  res.status(200).json({
    success: true,
    data: {},
  })
})
