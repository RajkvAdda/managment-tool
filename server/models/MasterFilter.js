const mongoose = require('mongoose')
const { commonField } = require('./CommonField')

const MasterFilterSchema = new mongoose.Schema({
  id: Number,
  name: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'Please add a query name'],
  },
  description: String,
  page: {
    type: String,
    required: [true, 'Please add a page'],
  },
  filter: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Please add some filter'],
  },
  ...commonField,
})

// handle custome id
MasterFilterSchema.pre('save', async function (next) {
  if (!this.id) {
    const highestId = await this.model('MasterFilters')
      .findOne({}, 'id')
      .sort({ id: -1 })
      .exec()
    const newId = highestId ? highestId.id + 1 : 1
    this.id = newId
  }
  next()
})

module.exports = MasterFilterSchema
