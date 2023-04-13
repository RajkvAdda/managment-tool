const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')

// @desc      Get department
// @route     GET /api/v1/departments
// @access    Private
exports.getDepartments = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

// @desc      Get single department
// @route     GET /api/v1/departments/:id
// @access    Private
exports.getDepartment = asyncHandler(async (req, res, next) => {
  const department = await req.model.findById(req.params.id)
  res.status(200).json({
    success: true,
    data: department,
  })
})

// @desc      Add department
// @route     POST /api/v1/departments
// @access    Private
exports.addDepartment = asyncHandler(async (req, res, next) => {
  // ckeck for id
  if (req.body?._id) {
    req.method = 'PUT'
    req.url = `/api/v1/departments/${req.body._id}`
    req.app.handle(req, res, next)
  } else {
    const department = await req.model.create({ ...req.body, ...req.common })
    res.status(201).json({
      success: true,
      data: department,
    })
  }
})

// @desc      Update department
// @route     PUT /api/v1/departments/:id
// @access    Private
exports.updateDepartment = asyncHandler(async (req, res, next) => {
  const department = await req.model.findByIdAndUpdate(
    req.params.id,
    { ...req.body, ...req.common },
    {
      new: true,
      runValidators: true,
    }
  )

  res.status(200).json({
    success: true,
    data: department,
  })
})

// @desc      Delete department
// @route     DELETE /api/v1/departments/:id
// @access    Private
exports.deleteDepartment = asyncHandler(async (req, res, next) => {
  await req.model.findByIdAndDelete(req.params.id)
  res.status(200).json({
    success: true,
    data: {},
  })
})

// @desc      Delete department
// @route     DELETE /api/v1/departments
// @access    Private
exports.deleteManyDepartments = asyncHandler(async (req, res, next) => {
  if (!Array.isArray(req.body)) {
    return next(new ErrorResponse('Bad Request, we expect array of ids', 400))
  }
  await req.model.deleteMany({ _id: { $in: req.body } })
  res.status(200).json({
    success: true,
    data: {},
  })
})
