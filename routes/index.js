const express = require('express')
const {userAuthMiddleware} = require('../middlewares')
const {getRecommendations} = require('../controllers')
const router = express.Router()

router.get('/recommendations', userAuthMiddleware, getRecommendations)

module.exports = router