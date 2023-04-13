const crypto = require('crypto')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { UserTypeEnum, Superadmin } = require('../utils/enum')
const {
  EmailPattern,
  PasswordPattern,
  MobilePattern,
} = require('../utils/pattern')
const { commonField } = require('./CommonField')

const UserSchema = new mongoose.Schema({
  id: Number,
  name: {
    type: String,
    trim: true,
    minlength: 3,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [EmailPattern.pattern, EmailPattern.patternMsg],
  },
  mobile: {
    type: String,
    required: [true, 'Please add an mobile'],
    unique: true,
    match: [MobilePattern.pattern, MobilePattern.patternMsg],
  },
  userType: {
    type: String,
    enum: [UserTypeEnum.USER, UserTypeEnum.ADMIN, Superadmin],
    default: UserTypeEnum.USER,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  role: {
    type: mongoose.Schema.ObjectId,
    ref: 'Roles',
  },
  branch: {
    type: mongoose.Schema.ObjectId,
    ref: 'Branches',
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    match: [PasswordPattern.pattern, PasswordPattern.patternMsg],
    select: false,
  },
  superadmin: {
    type: String,
    required: [true, 'Please add a superadmin details'],
    select: false,
  },
  avatar: String,
  designation: {
    type: mongoose.Schema.ObjectId,
    ref: 'Designations',
  },
  department: {
    type: mongoose.Schema.ObjectId,
    ref: 'Departments',
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  ...commonField,
})

// UserSchema.index({
//   name: 'text',
//   email: 'text',
//   mobile: 'text',
//   userType: 'text',
// })

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.pre('save', async function (next) {
  if (!this.id) {
    const highestId = await this.model('Users')
      .findOne({}, 'id')
      .sort({ id: -1 })
      .exec()
    const newId = highestId ? highestId.id + 1 : 1
    this.id = newId
  }
  next()
})

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function (dbs) {
  return jwt.sign(
    {
      id: this._id,
      dbs: dbs,
      email: this.email,
      userType: this.userType,
      role: this.role,
      isActive: this.isActive,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  )
}

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function (
  expireTime = 10 * 60 * 1000
) {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex')

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  // Set expire
  this.resetPasswordExpire = Date.now() + expireTime

  return resetToken
}

module.exports = mongoose.model('Users', UserSchema)
