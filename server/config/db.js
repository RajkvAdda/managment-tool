const mongoose = require('mongoose')

const connectDB = async () => {
  let dbName = 'masters'
  const conn = await mongoose.connect(process.env.MONGO_URI + `/${dbName}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  console.log(
    `MongoDB Connected master: ${conn.connection.host}`.cyan.underline.bold
  )
}

const connectUserDB = async (dbName) => {
  if (!dbName) return false
  const conn = await mongoose.connect(process.env.MONGO_URI + `/${dbName}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  console.log(
    `MongoDB Connected ${dbName}: ${conn.connection.host}`.cyan.underline.bold
  )
}
module.exports = { connectDB, connectUserDB }
