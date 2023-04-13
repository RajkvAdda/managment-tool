const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')
const geocoder = require('../utils/geocoder')

// @desc      GET GEO LOCATION
// @route     GET /api/v1/getlocation?address
// @access    Public
exports.getLocation = asyncHandler(async (req, res, next) => {
  // if address not have
  if (!req.query.address) {
    return next(new ErrorResponse(`We did not find any addrees`, 404))
  }
  const loc = await geocoder.geocode(req.query.address)
  const location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  }

  res.status(200).json({
    success: true,
    data: location,
  })
})

// Get token from model, create cookie and send response
exports.sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken(user.superadmin)

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  }

  if (process.env.NODE_ENV === 'production') {
    options.secure = true
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  })
}
