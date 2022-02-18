const { getUsers } = require('../controllers/user-controllers');
const usersRouter = require('express').Router();

usersRouter.get('/', getUsers)

module.exports = usersRouter;