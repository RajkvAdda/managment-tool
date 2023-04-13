const mongoose = require('mongoose')
const { ModuleEnum } = require('../utils/enum')
const { getMaxNumber } = require('../utils/common')

const PageSchema = new mongoose.Schema(
  {
    id: Number,
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'Page name required'],
    },
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
    parentScreenId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Pages',
    },
  },
  { toJSON: { virtuals: true } }
)

// handle custome id
PageSchema.pre('save', async function (next) {
  if (!this.id) {
    const highestId = await this.model('Pages')
      .findOne({ module: this.module }, 'id')
      .sort({ id: -1 })
      .exec()
    const newId = highestId ? highestId.id + 1 : this.module + 1
    this.id = newId
  }
  next()
})

PageSchema.virtual('moduleName').get(function () {
  let moduleName = ''
  for (const key in ModuleEnum) {
    if (ModuleEnum[key] === this.module) {
      moduleName = key
    }
  }
  return moduleName
})
module.exports = mongoose.model('Pages', PageSchema)
