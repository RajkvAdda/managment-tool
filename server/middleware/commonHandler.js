exports.commonHandler = (app) => (req, res, next) => {
  req.app = app
  // check for post and put
  if (req.method == 'POST') {
    req.common = {
      createdBy: req.user.id,
      createdAt: new Date().toISOString(),
    }
    return next()
  }
  if (req.method == 'PUT') {
    req.common = {
      updatedBy: req.user.id,
      updatedAt: new Date().toISOString(),
    }
    return next()
  }
  next()
}
