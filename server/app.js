//npm modules
const express = require('express');
const uuid = require('uuid/v4')
const session = require('express-session')
const bodyParser = require('body-parser');

const passport = require('passport');
require('./auth/passport')(passport);

const SequelizeSessionStore = require('connect-session-sequelize')(session.Store);
const models = require('./models');


const mySessionStore = new SequelizeSessionStore({
  db: models.sequelize
});



// create the server
const app = express();

// add & configure middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
  genid: (req) => {
    return uuid(); // use UUIDs for session IDs
  },
  store: mySessionStore,
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}))
//create session tables 
mySessionStore.sync();

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/user', require('./routes/users'));
app.use('/api/url', require('./routes/urls'));
// create the homepage route at '/'
app.get('/', (req, res) => {
  res.send(`You got home page!\n`)
});

//test
const {ensureAuthenticated} = require('./auth/auth');
app.get('/authrequired', ensureAuthenticated, (req, res) =>{
  res.send('Auth endpoint reached!');
});


// // tell the server what port to listen on
// models.sequelize.sync().then(function(){
//   app.listen(3000, () => {
//     console.log('Listening on localhost:3000')
//   });
// });

module.exports = app;

