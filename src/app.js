const express = require('express');
const { Category } = require('./routers/category');
const { Product } = require('./routers/product');

const app = express();
app.use(express.json());

app.use('/product', Product);
app.use('/category', Category);

app.get('/', (req, res) => {
  res.status(200).send('Congratulations You have reached our website');
});

exports.app = app;
