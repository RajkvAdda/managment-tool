const path = require('path')
const express = require('express')
require('dotenv').config()
const morgan = require('morgan')
require('colors')
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')
const errorHandler = require('./middleware/error')
const { connectDB } = require('./config/db')

const { protect } = require('./middleware/auth')

// Connect to database master
connectDB()

// Route files

const auth = require('./routes/auth')
const pages = require('./routes/pages')
const common = require('./routes/common')
// master module here
const users = require('./routes/users')
const roles = require('./routes/roles')
const company = require('./routes/company')
const branches = require('./routes/branches')
const designations = require('./routes/designations')
const departments = require('./routes/departments')
const masterFilters = require('./routes/masterFilters')

// purchase module here

const { createSuperadmin } = require('./controllers/users')
const { commonHandler } = require('./middleware/commonHandler')

const app = express()

// Body parser
app.use(express.json({ limit: '10mb', extended: true }))
app.use(
  express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 })
)

// Cookie parser
app.use(cookieParser())

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// File uploading
app.use(fileupload())

// Sanitize data
app.use(mongoSanitize())

// Set security headers
app.use(helmet())

// Prevent XSS attacks
app.use(xss())

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
})
app.use(limiter)

// Prevent http param pollution
app.use(hpp())

// Enable CORS
app.use(cors())

// eslint-disable-next-line prefer-arrow-callback
app.use(function (req, res, next) {
  console.log('ser reposnse')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type,Authorization,accept,access-control-allow-origin'
  )
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('referrer-policy', 'strict-origin-when-cross-origin')
  if (req.method === 'OPTIONS') res.send(200)
  else next()
})

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

// use router
app.use('/api/v1/auth', auth)

// create super admin
app.post('/api/v1/superadmin', createSuperadmin)

// handle pages
app.use('/api/v1/pages', pages)

// ======== Common =========== //
app.use('/api/v1', common)

app.use(protect)

// common filed and functionality handled
app.use(commonHandler(app))

// master module here
app.use('/api/v1/users', users)
app.use('/api/v1/roles', roles)
app.use('/api/v1/company', company)
app.use('/api/v1/branches', branches)
app.use('/api/v1/designations', designations)
app.use('/api/v1/departments', departments)
app.use('/api/v1/masterfilter', masterFilters)

// purchase module here

// erro handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, async () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`.red)
  // Close server & exit process
  // server.close(() => process.exit(1));
})
