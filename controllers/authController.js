const User = require('../models/User')
const jwt = require('jsonwebtoken')

// error handling
const handleErrors = err => {
  console.log(err.message);
  console.log(err.code);
  const errors = {
    email: '',
    password: ''
  }

  // login incorrect email
  if (err.message.includes('incorrect email')) {
    errors.email = 'email is not registered'
  }

  // login incorrect password
  if (err.message.includes('incorrect password')) {
    errors.password = 'this password in incorrect'
  }

  // validation errors
  for (let path in err.errors) {
    errors[path] = err.errors[path].message
  }

  // duplicate user error
  if (err.code === 11000) {
    errors.email = 'email is already registered'
  }
  return errors
}

const maxAge = 3600 * 72
const createToken = id => {
  return jwt.sign( { id }, 'my super sicret toKEN!11', {
    expiresIn: maxAge
  })
}

const signup_get = (req, res) => {
  res.render('signup')
}

const login_get = (req, res) => {
  res.render('login')
}

const signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password })
    // create token
    const token = createToken(user._id)
    // send token as a cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: maxAge * 1000
    })

    res.status(201).json({ user: user._id })
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({ errors })
  }
}

const login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password)
    // create token
    const token = createToken(user._id)
    // send token as a cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: maxAge * 1000
    })

    res.status(200).json({ user: user._id })
  } catch (err) {
    const errors = handleErrors(err)

    res.status(400).json({ errors })
  }
}

const logout_get = (req, res) => {
  // delete cookie with jwt
  res.cookie('jwt', '', {
    maxAge: 1,
    httpOnly: true
  })

  res.redirect('/')
}

module.exports = {
  signup_get,
  signup_post,
  login_get,
  login_post,
  logout_get
}
