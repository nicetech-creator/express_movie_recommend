const express = require('express')
const {userAuthMiddleware} = require('../middlewares')

const router = express.Router()

router.get('/recommendations', userAuthMiddleware, (req, res) => {
  console.log(req.userId)
  res.send("Hello Trayt_Health")
})

module.exports = router