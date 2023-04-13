const advancedResults = (populate, type) => async (req, res, next) => {
  let query

  // Copy req.query
  const reqQuery = { ...req.query, ...(req.body ?? {}) }
  console.log('queryStr', reqQuery)

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit']

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param])

  // Create query string
  let queryStr = JSON.stringify(reqQuery)

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(eq|ne|gt|gte|in|nin|lt|lte|and|not|or|nor|regex|options|text|expr|all|size)\b/g,
    (match) => `$${match}`
  )
  console.log('queryStr', queryStr)

  // aasing req model to model
  let model = req.model

  let total = 0

  // check if user modal
  if (type === 'user') {
    total = await model.find({ superadmin: req.user.dbs }).countDocuments()
    // Finding resource
    query = model.find({
      superadmin: req.user.dbs,
      ...JSON.parse(queryStr),
    })
  } else {
    total = await model.countDocuments()
    // Finding resource
    query = model.find({ ...JSON.parse(queryStr) })
  }

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ')
    query = query.select(fields)
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 25
  const startIndex = (page - 1) * limit
  query = query.skip(startIndex).limit(limit)

  if (populate) {
    query = query.populate(populate)
  }

  // Executing query
  const results = await query

  res.advancedResults = {
    success: true,
    totalRecord: total,
    data: results,
  }

  next()
}

module.exports = advancedResults
