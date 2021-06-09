const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser')
const { requireAuth, checkUser } = require('./middleware/authMiddleware')

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser())

// view engine
app.set('view engine', 'ejs');

// database connection
// const dbURI = 'mongodb+srv://todo_app:todo_app135@maxcluster20210505.stdvj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const dbURI = 'mongodb://127.0.0.1:27017/myFirstDatabase?gssapiServiceName=mongodb';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => {
    console.log('start successful');
    app.listen(3000)
  })
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser)
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes)
