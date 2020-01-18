import apiRoutes from "./api";
import express, {Router} from "express";
import usersControllers from '../controllers/users';
import ensureAuthenticated from '../auth/auth';
import path from 'config';
const app = Router();

// define all routes here.
app.use('/api', apiRoutes);

//short url redirector
app.get('/u/:code', usersControllers.get.shortUrlRedirect);


// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
	//Set static folder
	app.use(express.static('./../../client/build'));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

app.get('/authrequired', ensureAuthenticated, (req, res) => {
	res.send('Auth endpoint reached!');
});

export default app;