const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const asyncHandler = require('./async')
const ErrorResponse = require('../utils/errorResponse')
const { Superadmin, UserTypeEnum, PermissionEnum } = require('../utils/enum')
const RoleSchema = require('../models/Role')

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1]

    // Set token from cookie
  } else if (req.cookies.token) {
    token = req.cookies.token
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse("Unauthorized. You shouldn't be here.", 401))
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log('token', decoded)
    req.user = decoded
    req.userDB = mongoose.connection.useDb(decoded.dbs)
    next()
  } catch (err) {
    return next(new ErrorResponse("Unauthorized. You shouldn't be here.", 401))
  }
})

// Grant access to specific userType
exports.authorize = (pageId) => {
  const userTypes = [UserTypeEnum.ADMIN, Superadmin]
  return async (req, res, next) => {
    if (req.user.isActive !== false) {
      // if the user is superadmin or admin
      if (userTypes.includes(req.user.userType)) {
        return next()
      }

      // if the user have permission
      let permission = []
      if (req.user.role && pageId) {
        const Role = await req.userDB.model('Roles', RoleSchema)
        const role = await Role.findById(req.user.role)
        if (role) {
          permission = role.permission?.[pageId] ?? []
        }
      }
      console.log('permission', PermissionEnum[req.method], pageId, permission)
      if (permission?.length > 0) {
        if (permission?.includes(PermissionEnum[req.method])) {
          return next()
        }
      } else if (req.method === 'GET') {
        return next()
      }
    }

    next(new ErrorResponse(`Unauthorized. You shouldn't be here.`, 401))
  }
}
