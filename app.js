const express = require('express')
const cors = require('cors')

const router = require('./routes')

const LISTENING_PORT = 9000
const app = express()

app.use(cors())
app.use(express.json())
app.use('/', router)

const server = app.listen(LISTENING_PORT, function () {
  console.log(`Server is listening on ${LISTENING_PORT}`)
})
