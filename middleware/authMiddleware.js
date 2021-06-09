const jwt = require('jsonwebtoken')
const User = require('../models/User')

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt

  // check jwt exists
  if (token) {
    jwt.verify(token, 'my super sicret toKEN!11', (err, decodedToken) => {
      if (err) {
        res.redirect('/login')
        console.log(err )
      }
      console.log(decodedToken);
      next()
    })
  } else {
    res.redirect('/login')
  }
}

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, 'my super sicret toKEN!11', async (err, decodedToken) => {
      if (err) {
        res.locals.user = null
        next()
      } else {
        let user = await User.findById(decodedToken.id)
        res.locals.user = user
        next()
      }
    })
  } else {
    res.locals.user = null
    next()
  }
}

module.exports = { requireAuth, checkUser }
