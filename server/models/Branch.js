const mongoose = require('mongoose')
const { commonField } = require('./CommonField')
const geocoder = require('../utils/geocoder')

const BranchSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please add comapany name'],
  },
  responsiblePerson: {
    type: String,
    required: [true, 'Please add Responsible Person'],
  },
  address: {
    type: String,
  },
  stateCode: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  superadmin: {
    type: String,
    require,
    select: true,
  },
  ...commonField,
})

module.exports = BranchSchema
