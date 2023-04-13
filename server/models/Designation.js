const mongoose = require('mongoose')
const { commonField } = require('./CommonField')

const DesignationSchema = new mongoose.Schema({
  id: Number,
  name: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'Please add a designation name'],
  },
  description: String,
  ...commonField,
})

// handle custome id
DesignationSchema.pre('save', async function (next) {
  if (!this.id) {
    const highestId = await this.model('Designations')
      .findOne({}, 'id')
      .sort({ id: -1 })
      .exec()
    const newId = highestId ? highestId.id + 1 : 1
    this.id = newId
  }
  next()
})

module.exports = DesignationSchema
