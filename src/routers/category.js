const Router = require('express').Router();
const { logger } = require('../logger');
const { Category } = require('../models/category');

Router.get('/', async (req, res) => {
  try {
    const categoryList = await Category.find();

    if (categoryList) {
      res.status(500).json({
        message: 'The Category List does not exists.',
        status: 'error',
      });
    } else {
      res.status(200).json({ data: categoryList, status: 'success' });
    }
  } catch (err) {
    res.status(500).json({
      message: 'Sorry!! The server encounterd an internal error.',
      status: 'error',
      data: err,
    });
    logger.error(error);
  } finally {
    logger.info(`Served get request for category to ${req.ip}`);
  }
});

Router.post('/', async (req, res) => {
  // Function for data validation and error handeling.
  const validateInput = () => {
    try {
      const { name, icon, color } = req.body;
      return { name, icon, color };
    } catch (err) {
      res.status(404).json({
        message: 'Required fields are not present in the request.',
        status: 'error',
        data: err,
      });
      return false;
    }
  };

  let requestData = validateInput();
  if (Object.keys(requestData).length === 3) {
    try {
      const category = new Category(requestData);
      const result = await category.save();
      res.status(200).json({
        message: 'The data has been added successfully to the database',
        data: result,
        status: 'success',
      });
    } catch (err) {
      res.status(500).json({
        message:
          'The server encounterd an error while writing to the database.',
        status: 'error',
        data: err,
      });
      logger.error(err);
    }
  }

  logger.info(`Served post request for category to ${req.ip}`);
});

// TODO: Add a bulk delete functionality.
Router.delete('/:categoryId', async (req, res) => {
  if (req.params.categoryId) {
    try {
      const result = await Category.findByIdAndDelete(req.params.categoryId);
      res.status(201).json({
        message: 'The resource has been successfully deleted',
        data: result,
        status: 'success',
      });
    } catch (err) {
      res.status(500).json({
        message: "Can't delete the resource with this id!",
        status: 'error',
        data: err,
      });
      logger.error(err);
    }
  }
});

// Put methood to update category
Router.put('/:categoryId', async (req, res) => {
  if (req.params.categoryId) {
    try {
      const { name, color, icon } = req.body;
      const updates = {
        name,
        color,
        icon,
      };
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.categoryId,
        updates
      );
      res.status(200).json({
        message: 'The requested category has been updated',
        error: 'error',
        data: updatedCategory,
      });
      logger.log(`Update category ${req.body.categoryId}`);
    } catch (error) {
      logger.error(`Can not perform put on categoryId.`);
      res.status(500).json({
        message: 'The update can not be done',
        status: 'error',
        data: error,
      });
    } finally {
      logger.log(`Served a POST request for ${req.ip}`);
    }
  }
});

exports.Category = Router;
