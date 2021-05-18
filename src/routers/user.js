const Router = require('express').Router();
const { User } = require('../models/user');

Router.get('/', async (req, res) => {
  try {
    const desiredFilters = [
      {},
      { id: req.query.id },
      { name: req.params.name },
    ];
    const desiredFields = { name: 1, email: 1, phone: 1, country: 1, _id: 0 };
    const limit = +req.query.limit ? +req.query.limit : 1;
    const result = await User.find({}).limit(limit);
    res.status(200).json({
      message: 'The requested user details are here',
      status: 'success',
      data: result,
    });
    logger.info('The requested user was found.');
  } catch (error) {
    res.status(200).json({
      message: 'The request could not be completed',
      status: 'error',
      data: error,
    });
    logger.error('An error occurred while trying get users.');
  } finally {
    logger.info(`A GET request was served on users for ${req.ip}`);
  }
});
