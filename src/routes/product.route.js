const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

router
  .route('/')
  .post(productController.createProduct)
  .get(productController.getAllProducts);

module.exports = router;
