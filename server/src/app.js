//npm modules
import express from 'express';
import uuid from 'uuid/v4';
import helmet from 'helmet'
import session from 'express-session';
import bodyParser from 'body-parser';
import passport from 'passport';
require('./auth/passport')(passport);


const SequelizeSessionStore = require('connect-session-sequelize')(
	session.Store
);
const models = require('./models');
import cors from 'cors';
import routes from "./routes";

//set db for sessions
const mySessionStore = new SequelizeSessionStore({
	db: models.sequelize,
});

// create the server
const app = express();
// app.use(helmet());
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

app.use("/", routes);


export default app;
