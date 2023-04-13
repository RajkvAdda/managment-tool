const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc      Get single company
// @route     GET /api/v1/company
// @access    Private
exports.getCompany = asyncHandler(async (req, res, next) => {
  const company = await req.model.findOne({ superadmin: req.user.dbs })

  if (!company) {
    return next(new ErrorResponse(`No company found for this user`, 404))
  }

  res.status(200).json({
    success: true,
    data: company,
  })
})

// @desc      Update company
// @route     PUT /api/v1/company/:id
// @access    Private
exports.updateCompany = asyncHandler(async (req, res, next) => {
  let company = await req.model.findById(req.params.id)

  // company not exist
  if (!company) {
    return next(new ErrorResponse(`No company found for this user`, 404))
  }
  // superadmin details should not update
  delete req.body.superadmin

  company = await req.model.findByIdAndUpdate(
    req.params.id,
    { ...req.body, ...req.common },
    {
      new: true,
      runValidators: true,
    }
  )

  res.status(200).json({
    success: true,
    data: company,
  })
})
