const apiRouter = require('express').Router();
const { getEndpointJson } = require('../controllers/controllers.js')

apiRouter.get('/', getEndpointJson);

module.exports = apiRouter;