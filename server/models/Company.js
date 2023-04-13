const mongoose = require('mongoose')
const geocoder = require('../utils/geocoder')
const { EmailPattern, MobilePattern } = require('../utils/pattern')
const { commonField } = require('./CommonField')

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Please add comapany name'],
    },
    cinNumber: {
      type: String,
    },
    responsiblePerson: {
      type: String,
      required: [true, 'Please add Responsible Person'],
    },
    address: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      match: [EmailPattern.pattern, EmailPattern.patternMsg],
    },
    mobile: {
      type: String,
      unique: true,
      match: [MobilePattern.pattern, MobilePattern.patternMsg],
    },
    stateCode: {
      type: String,
    },
    avatar: String,
    website: {
      type: String,
    },
    dateOfEstablished: {
      type: Date,
      required: [true, 'Please add a Established date'],
      default: Date.now,
    },
    superadmin: {
      type: String,
      require,
      select: true,
    },
    ...commonField,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = CompanySchema
