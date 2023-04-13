const os = require('os')
const mongoose = require('mongoose')
const AuditSchema = require('../models/Audit')
const Page = require('../models/Page')
const User = require('../models/User')

exports.createAudit = async (doc, pageId, method, remarks) => {
  // get user details
  let user = await User.findById(doc.createdBy).select('+superadmin')
  if (!user) {
    return null
  }
  let page = await Page.findById(pageId)
  if (!page) {
    return null
  }
  let body = {
    user: {
      id: user?._id,
      name: user.name,
    },
    page: {
      id: page?._id,
      name: page.name,
    },
  }
  // handle POST
  if (method == 'POST') {
    body.actionDetails = {
      method: method,
      actionDetails: JSON.stringify({ id: doc._id }),
      remarks: remarks,
    }
  }
  const userDB = mongoose.connection.useDb(user.superadmin)
  let Audit = userDB.model('Audits', AuditSchema)
  Audit.create(body)
}
