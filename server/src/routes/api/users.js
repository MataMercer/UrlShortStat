import {Router} from "express";
import ensureAuthenticated from '../../auth/auth';
import usersControllers from '../../controllers/users';

const app = Router();

app.post('/register', usersControllers.post.register);

app.post('/login', usersControllers.post.login);

app.post('/logout', usersControllers.post.logout);

app.put('/edit', ensureAuthenticated, usersControllers.put.editAccount);

app.delete('/', ensureAuthenticated, usersControllers.deletion.accountDelete);

app.get('/usernameandemail', ensureAuthenticated, usersControllers.get.getUsernameAndEmail);

export default app;
