const { getUsers, getUser } = require('../controllers/user-controllers');
const usersRouter = require('express').Router();

usersRouter.get('/', getUsers)
usersRouter.get('/:username', getUser)

module.exports = usersRouter;