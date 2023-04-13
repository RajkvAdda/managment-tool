const mongoose = require('mongoose')
const { commonField } = require('./CommonField')

const RoleSchema = new mongoose.Schema({
  id: Number,
  name: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'Please add a role name'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  permission: {
    type: mongoose.Schema.Types.Mixed,
  },
  ...commonField,
})

// handle custome id
RoleSchema.pre('save', async function (next) {
  if (!this.id) {
    const highestId = await this.model('Roles')
      .findOne({}, 'id')
      .sort({ id: -1 })
      .exec()
    const newId = highestId ? highestId.id + 1 : 1
    this.id = newId
  }
  next()
})

module.exports = RoleSchema
