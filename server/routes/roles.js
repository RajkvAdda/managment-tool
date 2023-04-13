const express = require('express')
const {
  addRole,
  deleteRole,
  getRole,
  getRoles,
  updateRole,
  deleteManyRoles,
} = require('../controllers/roles')
const advancedResults = require('../middleware/advancedResults')
const { authorize } = require('../middleware/auth')
const RoleSchema = require('../models/Role')
const ErrorResponse = require('../utils/errorResponse')

const router = express.Router()

// assing  model to req object
router.all('*', async (req, res, next) => {
  const Modal = await req.userDB.model('Roles', RoleSchema)
  req.model = Modal
  next()
})

// handle authorization
router.use(authorize(104))

router
  .route('/')
  .get(advancedResults(), getRoles)
  .post(addRole)
  .delete(deleteManyRoles)

router
  .param('id', async (req, res, next, id) => {
    const role = await req.model.findById(id)
    if (!role) {
      return next(new ErrorResponse(`No role with the id of ${id}`), 404)
    }
    next()
  })
  .route('/:id')
  .get(getRole)
  .put(updateRole)
  .delete(deleteRole)

module.exports = router
