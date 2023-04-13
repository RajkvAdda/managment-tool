const express = require('express')
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getMe,
  updatePassword,
} = require('../controllers/users')

const User = require('../models/User')
const router = express.Router({ mergeParams: true })
const { authorize } = require('../middleware/auth')
const advancedResults = require('../middleware/advancedResults')
const ErrorResponse = require('../utils/errorResponse')
const { Superadmin } = require('../utils/enum')

// assing the Role model to req object
router.all('*', async (req, res, next) => {
  req.model = User
  next()
})

// ====================
router.get('/loginuser', getMe)
router.put('/updatepassword', updatePassword)
router.use(authorize(101))
router.route('/').post(advancedResults(null, 'user'), getUsers)
router.route('/create').post(createUser)

// ====================
router
  .param('id', async (req, res, next, id) => {
    const user = await User.findById(id)
    if (!user) {
      return next(new ErrorResponse(`No user with the id of ${id}`), 404)
    }

    // check user cant change th sun
    if (req?.body) {
      if (user?.userType === Superadmin) {
        if (req?.body?.userType !== Superadmin) {
          return next(
            new ErrorResponse(
              `Can not change the Superadmin as ${req?.body?.userType}`
            ),
            403
          )
        }
      }
    }
    next()
  })
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser)

module.exports = router
