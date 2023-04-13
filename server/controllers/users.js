const mongoose = require('mongoose')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const sendEmail = require('../utils/sendEmail')
const User = require('../models/User')
const CompanySchema = require('../models/Company')
const { Superadmin } = require('../utils/enum')
const BranchSchema = require('../models/Branch')
const { sendTokenResponse } = require('./common')

// @desc      Get all users
// @route     GET /api/v1/users
// @access    Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

// @desc      Get single user
// @route     GET /api/v1/users/:id
// @access    Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)
  res.status(200).json({
    success: true,
    data: user,
  })
})

// @desc      Get current logged in user
// @route     POST /api/v1/users/loginuser
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  if (!user) {
    return next(new ErrorResponse(`Invalid User Details`, 401))
  }
  res.status(200).json({
    success: true,
    data: user,
  })
})

// @desc      Update password
// @route     PUT /api/v1/users/updatepassword
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password')

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401))
  }

  user.password = req.body.newPassword
  await user.save()

  sendTokenResponse(user, 200, res)
})

// @desc      Create user
// @route     POST /api/v1/users
// @access    Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  console.log('file', req.file)

  // check for array
  if (Array.isArray(req.body)) {
    await req.body?.forEach(async function (doc) {
      // if trying to update superadmin
      if (doc.userType === Superadmin) {
        return next(
          new ErrorResponse(`Invalid userType to update superadmin`, 404)
        )
      }
      if (doc?._id) {
        delete doc.password
        await User.findByIdAndUpdate(
          { _id: doc._id },
          { ...doc, ...req.common },
          {
            validateBeforeSave: false,
            new: true,
            runValidators: true,
          }
        )
      } else {
        const body = {
          ...doc,
          ...req.common,
          superadmin: req.user.dbs,
          password: 'User@1234',
        }
        await User.create(body)
      }
    })
    res.status(200).json({
      success: true,
      data: {},
    })
    return
  }

  // check for user should not a superadmin
  if (req.body.userType === Superadmin) {
    return next(
      new ErrorResponse(`Invalid userType to create ${req.body.userType}`, 401)
    )
  }

  // ckeck for id
  if (req.body?._id) {
    req.method = 'PUT'
    req.url = `/api/v1/users/${req.body._id}`
    req.app.handle(req, res, next)
  } else {
    const body = {
      ...req.body,
      ...req.common,
      superadmin: req.user.dbs,
      password: 'User@1234',
    }
    const user = await User.create(body)
    delete user.superadmin
    delete user.password

    res.status(201).json({
      success: true,
      data: user,
    })
  }
})

// @desc      Update user
// @route     PUT /api/v1/users/:id
// @access    Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  console.log('file', req.file)
  // if trying to update superadmin
  if (req.body.userType === Superadmin) {
    return next(new ErrorResponse(`Invalid userType to update superadmin`, 404))
  }

  // // not allow to update password and superadmin
  const body = {
    ...req.body,
    ...req.common,
  }
  delete body.password
  delete body.superadmin

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { ...body },
    {
      validateBeforeSave: false,
      new: true,
      runValidators: true,
    }
  )
  delete user.superadmin
  delete user.password

  res.status(200).json({
    success: true,
    data: user,
  })
})

// @desc      Delete user
// @route     DELETE /api/v1/users/:id
// @access    Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  // if trying to delete superadmin
  let user = await User.findById(req.params.id)
  if (user.userType === Superadmin) {
    return next(new ErrorResponse(`Invalid userType to delete superadmin`, 401))
  }

  // check for login user const user = await User.findById(req.user.id)
  user = await User.findById(req.user.id)
  if (!user) {
    return next(new ErrorResponse(`Login user can not be deletable`, 401))
  }

  await User.findByIdAndDelete(req.params.id)
  res.status(200).json({
    success: true,
    data: {},
  })
})

// @desc      Create Super amdin
// @route     POST /api/v1/superadmin
// @access    Secretkey
exports.createSuperadmin = asyncHandler(async (req, res, next) => {
  // check secretkey
  if (process.env.SUPER_SECRET_KEY !== req.query.secretkey) {
    return next(new ErrorResponse('Invalid secretkey', 404))
  }

  // userType should be superadmin only
  req.body.userType = Superadmin
  req.body.superadmin = Superadmin
  const user = await User.create({
    ...req.body,
    createdAt: new Date().toISOString(),
  })
  const modifiedUser = await User.findByIdAndUpdate(
    user._id,
    {
      superadmin: String(user._id),
      createdBy: user._id,
    },
    {
      new: true,
      runValidators: true,
    }
  )

  // create db for this superadmin and add company details
  const userDB = mongoose.connection.useDb(String(user._id))
  const Company = userDB.model('Company', CompanySchema)
  await Company.create({
    name: modifiedUser.name,
    responsiblePerson: modifiedUser.name,
    superadmin: String(user._id),
    createdBy: modifiedUser._id,
    createdAt: new Date().toISOString(),
  })

  const Branch = userDB.model('Branch', BranchSchema)
  await Branch.create({
    name: modifiedUser.name,
    responsiblePerson: modifiedUser.name,
    superadmin: String(user._id),
    createdBy: modifiedUser._id,
    createdAt: new Date().toISOString(),
  })
  // send email to user to reset password and login
  // Get reset token
  const resetToken = modifiedUser.getResetPasswordToken(7 * 24 * 60 * 60 * 1000)
  await modifiedUser.save({ validateBeforeSave: false })

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`

  const message = `You are receiving this email because you (can reset password and start using) Please make a PUT request to: \n\n ${resetUrl}`

  try {
    await sendEmail({
      email: modifiedUser.email,
      subject: 'Account created in RajAdda',
      message,
    })

    res.status(200).json({ success: true, data: 'Email sent' })
  } catch (err) {
    console.log(err)
    modifiedUser.resetPasswordToken = undefined
    modifiedUser.resetPasswordExpire = undefined
    await modifiedUser.save({ validateBeforeSave: false })
    return next(new ErrorResponse('Email could not be sent', 500))
  }
})
