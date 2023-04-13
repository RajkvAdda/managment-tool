const mongoose = require('mongoose')

exports.commonField = {
  custom: mongoose.Schema.Types.Mixed,
  custom2: mongoose.Schema.Types.Mixed,
  createdAt: Date,
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users',
  },
  updatedAt: Date,
  updatedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users',
  },
}
