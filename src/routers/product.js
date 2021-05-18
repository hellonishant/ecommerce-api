const express = require('express');
const { Product } = require('../models/product');
const { logger } = require('../logger');
const { Category } = require('../models/category');
const { isValidObjectId } = require('mongoose');

const Router = express.Router();

Router.get('/', (req, res) => {
  Product.find({}, { name: 1, description: 1, category: 1, _id: 1 })
    // .select({ name: 1, description: 1, id: 0 })
    // The document name in populate in case sensitive.
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

// TODO: Add regular express to set parameter as optional.
Router.get('/featured/:count', (req, res) => {
  const count = req.params.count ? +req.params.count : 3;
  Product.find(
    { isFeatured: true },
    { name: 1, description: 1, category: 1, _id: 0 }
  )
    .limit(count)
    // .select({ name: 1, description: 1, id: 0 })
    // The document name in populate in case sensitive.
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

Router.get('/count', (req, res) => {
  Product.countDocuments()
    // .select({ name: 1, description: 1, id: 0 })
    // The document name in populate in case sensitive.
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

Router.get('/:productId', (req, res) => {
  try {
    if (!isValidObjectId(req.params.productId))
      throw `The product Id is not valid.`;
    Product.findById(req.params.productId)
      .populate('category')
      .then((result) => {
        logger.info('Successfully retrived data from the database.');
        res.status(200).json({
          message: 'The requested product was found',
          status: 'success',
          data: result,
        });
      });
  } catch (error) {
    logger.error('Error while trying to retrive data from database');
    res.status(500).json(error);
  }
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
      logger.error('Error occurred while trying to add new product.');
      res.status(500).json({ error, success: false });
    })
    .finally(() => logger.info(`Served post request for product to ${req.ip}`));
});

Router.delete('/:productId', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.productId))
      throw `The product Id is not valid.`;
    const productId = req.params.productId;
    const deletedProduct = await Product.findByIdAndDelete(productId);
    res.status(200).json({
      message: 'The product has been successfully deleted',
      status: 'success',
      data: deletedProduct,
    });
    logger.info('The product has been successfully deleted.');
  } catch {
    req.status(500).json({
      message: 'An error occurred while deleteing a product.',
      status: 'error',
      data: error,
    });
    logger.error(`An error occurred while deleting the product.`);
  } finally {
    logger.info(`Served a DELETE request for ${req.ip}`);
  }
});

Router.put('/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    if (!isValidObjectId(req.params.productId))
      throw `The product Id is not valid.`;
    let updatedProduct;
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
    const toUpdate = {
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
    };

    if (await Product.findById(productId))
      updatedProduct = await Product.findByIdAndUpdate(productId, {
        $set: toUpdate,
      });
    res.status(200).json({
      message: 'The product has been successfully updated',
      status: 'success',
      data: updatedProduct,
    });
    logger.info(`The product has been successfully updated`);
  } catch (err) {
    console.log(err);
    logger.error(`An error occurred while updating product.`);
    res.status(500).json({
      message: 'An error occurred while updating the product',
      status: 'error',
      data: err,
    });
  } finally {
    logger.info(`Served a POST request from ${req.ip}`);
  }
});

exports.Product = Router;
