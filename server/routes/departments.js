const express = require('express')
const {
  addDepartment,
  deleteDepartment,
  deleteManyDepartments,
  getDepartment,
  getDepartments,
  updateDepartment,
} = require('../controllers/departments')
const advancedResults = require('../middleware/advancedResults')
const { authorize } = require('../middleware/auth')
const DepartmentSchema = require('../models/Department')
const ErrorResponse = require('../utils/errorResponse')

const router = express.Router()

// assing the Role model to req object
router.all('*', async (req, res, next) => {
  const Modal = await req.userDB.model('Departments', DepartmentSchema)
  req.model = Modal
  next()
})

// handle authorization
router.use(authorize(106))

router
  .route('/')
  .get(advancedResults(), getDepartments)
  .post(addDepartment)
  .delete(deleteManyDepartments)

router
  .param('id', async (req, res, next, id) => {
    const department = await req.model.findById(id)
    if (!department) {
      return next(new ErrorResponse(`No department with the id of ${id}`), 404)
    }
    next()
  })
  .route('/:id')
  .get(getDepartment)
  .put(updateDepartment)
  .delete(deleteDepartment)

module.exports = router
