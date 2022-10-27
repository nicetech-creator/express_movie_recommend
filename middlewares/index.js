/**
 * Get user's ID using Bearer Token
 * If no Beare token is given, return 401 response
 * otherwise proceed to next handler
 * 
 */
 const userAuthMiddleware = (req, res, next) => {
    try {
      const bearerHeader = req.headers['authorization'];  
      if(typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1]
        req.userId = bearerToken
        next()
      } else {
        res.sendStatus(401)
      }
    } catch (error) {
      res.sendStatus(401)
    }
  }
  
  module.exports = {
    userAuthMiddleware,
  }
  
  