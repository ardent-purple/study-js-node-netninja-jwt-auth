const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [ true, 'Please, enter the email' ],
    unique: true,
    lowercase: true,
    validate: [ isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [ true, 'Please, enter the password' ],
    minlength: [ 6, 'Minimum password length is 6 characters']
  }
})

// mongoose hooks
// fire function after saving to db
userSchema.post('save', function(doc, next) {
  console.log('new user was created and saved');
  console.log(doc);
  next()
})

userSchema.pre('save', async function(next) {
  // `this` is created doc (local!)
  // console.log('user is about to be created!', this)

  // hash password
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// static method to log in user
userSchema.statics.login = async function(email, password) {
  const user = await User.findOne({ email })
  if (user) {
    const auth = await bcrypt.compare(password, user.password)
    if (auth) {
      return user
    }
    throw Error('incorrect password')
  }
  throw Error('incorrect email')
}

const User = mongoose.model('user', userSchema)

module.exports = User
