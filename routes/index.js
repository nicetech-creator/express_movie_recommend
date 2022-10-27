const express = require('express')

const router = express.Router()

router.get('/recommendations', (req, res) => {
  res.send("Hello Trayt_Health")
})

module.exports = router