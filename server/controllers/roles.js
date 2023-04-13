const { ErrorResponse } = require('@remix-run/router')
const asyncHandler = require('../middleware/async')

// @desc      Get roles
// @route     GET /api/v1/roles
// @access    Private
exports.getRoles = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

// @desc      Get single role
// @route     GET /api/v1/roles/:id
// @access    Private
exports.getRole = asyncHandler(async (req, res, next) => {
  const role = await req.model.findById(req.params.id)
  res.status(200).json({
    success: true,
    data: role,
  })
})

// @desc      Add Role
// @route     POST /api/v1/roles
// @access    Private
exports.addRole = asyncHandler(async (req, res, next) => {
  // ckeck for id
  if (req.body?._id) {
    req.method = 'PUT'
    req.url = `/api/v1/roles/${req.body._id}`
    req.app.handle(req, res, next)
  } else {
    const role = await req.model.create({ ...req.body, ...req.common })
    res.status(201).json({
      success: true,
      data: role,
    })
  }
})

// @desc      Update role
// @route     PUT /api/v1/roles/:id
// @access    Private
exports.updateRole = asyncHandler(async (req, res, next) => {
  const role = await req.model.findByIdAndUpdate(
    req.params.id,
    { ...req.body, ...req.common },
    {
      new: true,
      runValidators: true,
    }
  )

  res.status(200).json({
    success: true,
    data: role,
  })
})

// @desc      Delete role
// @route     DELETE /api/v1/roles/:id
// @access    Private
exports.deleteRole = asyncHandler(async (req, res, next) => {
  await req.model.findByIdAndDelete(req.params.id)
  res.status(200).json({
    success: true,
    data: {},
  })
})

// @desc      Delete role
// @route     DELETE /api/v1/roles
// @access    Private
exports.deleteManyRoles = asyncHandler(async (req, res, next) => {
  if (!Array.isArray(req.body)) {
    return next(new ErrorResponse('Bad Request, we expect array of ids', 400))
  }
  await req.model.deleteMany({ _id: { $in: req.body } })
  res.status(200).json({
    success: true,
    data: {},
  })
})
