// const express = require('express');
// const router = express.Router();
// var models = require('../../models');
// const { ensureAuthenticated } = require('../../auth/auth');
// const validUrl = require('valid-url');
// const shortid = require('shortid');
// const config = require('config');
// const Sequelize = require('sequelize');
// const Op = Sequelize.Op;
// const moment = require('moment');
import {Router} from "express";
import ensureAuthenticated from '../../auth/auth';
import urlsControllers from '../../controllers/urls';

const app = Router();

app.post('/create', ensureAuthenticated, urlsControllers.post.createUrl);

app.put('/edit', ensureAuthenticated, urlsControllers.put.editUrl);

app.get('/', ensureAuthenticated, urlsControllers.get.allUrls);

app.delete('/:code', ensureAuthenticated, urlsControllers.deletion.urlDelete);

app.post('/analytics', ensureAuthenticated, urlsControllers.post.analyze);

export default app;
