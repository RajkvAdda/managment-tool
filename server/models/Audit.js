const mongoose = require('mongoose')

const AuditSchema = new mongoose.Schema({
  user: {
    id: { type: mongoose.Schema.ObjectId, ref: 'Users', required: true },
    name: { type: String },
  },
  page: {
    id: { type: mongoose.Schema.ObjectId, ref: 'Pages', required: true },
    name: { type: String },
  },
  systemDetails: {
    ip: { type: String },
    name: { type: String },
  },
  actionDetails: {
    method: { type: String, enum: ['POST', 'PUT', 'DELETE'], required: true },
    actionDetails: { type: String, required: true },
    remarks: String,
  },
  actionTime: {
    type: Date,
    default: Date.now,
  },
})

module.exports = AuditSchema
