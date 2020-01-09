//npm modules
const express = require('express');
const uuid = require('uuid/v4');
const session = require('express-session');
const bodyParser = require('body-parser');

const passport = require('passport');
require('./auth/passport')(passport);

const SequelizeSessionStore = require('connect-session-sequelize')(
	session.Store
);
const models = require('./models');
const path = require('path');

var cors = require('cors');

const mySessionStore = new SequelizeSessionStore({
	db: models.sequelize,
});

// create the server
const app = express();

app.use(
	cors({
		credentials: true,
		origin: 'http://localhost:3000',
	})
);

// add & configure middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
	session({
		genid: req => {
			return uuid(); // use UUIDs for session IDs
		},
		store: mySessionStore,
		secret: 'keyboard cat',
		resave: false,
		saveUninitialized: true,
		cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
	})
);
//create session tables
mySessionStore.sync();

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/user', require('./routes/users'));
app.use('/api/url', require('./routes/urls'));

//urlshortener
app.get('/u/:code', async (req, res) => {
	// console.log(req);
	try {
		models.Url.findByPk(req.params.code).then(url => {
			if (url) {
				try {
					models.Visit.create({
						UrlCode: req.params.code,
					});
				} catch (err) {
					console.log(err);
				}
				return res.redirect(url.dataValues.originalUrl);
			} else {
				return res.status(404).json('No url found');
			}
		});
	} catch (err) {
		console.error(err);
		res.status(500).json('Server error');
	}
});

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
	//Set static folder
	app.use(express.static('./client/build'));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

//test
const { ensureAuthenticated } = require('./auth/auth');
app.get('/authrequired', ensureAuthenticated, (req, res) => {
	res.send('Auth endpoint reached!');
});

// // tell the server what port to listen on
// models.sequelize.sync().then(function(){
//   app.listen(3000, () => {
//     console.log('Listening on localhost:3000')
//   });
// });

module.exports = app;
