const express = require('express');
const { Product } = require('../models/product');
const { logger } = require('../logger');
const { Category } = require('../models/category');

const Router = express.Router();

Router.get('/', (req, res) => {
  Product.find({}, { name: 1, description: 1, category: 1, _id: 0 })
    // .select({ name: 1, description: 1, id: 0 })
    .populate('Category')
    .then((result) => {
      logger.info('Successfully retrived data from the database.');
      res.status(200).json({
        message: 'The requested product was found',
        status: 'success',
        data: result,
      });
    })
    .catch((error) => {
      logger.error('Error while trying to retrive data from database');
      res.status(500).json(error);
    });
});

Router.get('/:productId', (req, res) => {
  Product.findById(req.params.productId)
    .populate('category')
    .then((result) => {
      logger.info('Successfully retrived data from the database.');
      res.status(200).json({
        message: 'The requested product was found',
        status: 'success',
        data: result,
      });
    })
    .catch((error) => {
      logger.error('Error while trying to retrive data from database');
      res.status(500).json(error);
    });
});

Router.post('/', (req, res) => {
  const {
    name,
    description,
    richDescription,
    image,
    images,
    category,
    rating,
    countInStock,
    isFeatured,
    dateCreated,
    price,
    brand,
  } = req.body;

  if (!Category.findById(category))
    return res
      .status(500)
      .send({ message: 'The category does not exist.', status: 'error' });
  const product = new Product({
    name,
    description,
    richDescription,
    image,
    images,
    category,
    countInStock,
    rating,
    isFeatured,
    dateCreated,
    price,
    brand,
  });
  product
    .save()
    .then((result) => {
      logger.info('Successfull added product to the database');
      res.status(201).json({
        message: 'Successfully added the product to database',
        status: 'success',
        data: result,
      });
    })
    .catch((error) => {
      logger.error('Error occured while trying to add new product.');
      res.status(500).json({ error, success: false });
    })
    .finally(() => logger.info(`Served post request for product to ${req.ip}`));
});

exports.Product = Router;
