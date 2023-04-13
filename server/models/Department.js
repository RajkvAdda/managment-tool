const mongoose = require('mongoose')
const { commonField } = require('./CommonField')
const { ModuleEnum } = require('../utils/enum')

const DepartmentSchema = new mongoose.Schema(
  {
    id: Number,
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'Please add a department name'],
    },
    description: String,
    module: {
      type: Number,
      enum: [
        ModuleEnum.MASTER,
        ModuleEnum.PURCHASE,
        ModuleEnum.SALES,
        ModuleEnum.PRODUCTION,
        ModuleEnum.MAINTAINANCE,
      ],
      required: [true, 'Module is required'],
    },
    ...commonField,
  },
  { toJSON: { virtuals: true } }
)

// handle custome id
DepartmentSchema.pre('save', async function (next) {
  if (!this.id) {
    const highestId = await this.model('Departments')
      .findOne({}, 'id')
      .sort({ id: -1 })
      .exec()
    const newId = highestId ? highestId.id + 1 : 1
    this.id = newId
  }
  next()
})

DepartmentSchema.virtual('moduleName').get(function () {
  let moduleName = ''
  for (const key in ModuleEnum) {
    if (ModuleEnum[key] === this.module) {
      moduleName = key
    }
  }
  return moduleName
})

module.exports = DepartmentSchema
