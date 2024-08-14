const Product = require('../models/product.model');
const catchAsync = require('../utils/catchAsync');

exports.createProduct = catchAsync(async (req, res) => {
  const newProduct = await Product.create({
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    category: req.body.category,
    image: req.body.image,
    rating: req.body.rating,
  });
  return res.status(201).json({
    status: 'success',
    data: {
      product: newProduct,
    },
  });
});

exports.getAllProducts = catchAsync(async (req, res) => {
  console.log(`req.query --> `, req.query);

  // Build the query
  let query = Product.find();

  // filtering
  const filterObj = { ...req.query };
  console.log('filterObj Before --> ', filterObj);

  const excludedFields = ['page', 'limit', 'fields', 'sort'];
  excludedFields.forEach((el) => delete filterObj[el]);

  console.log('filterObj After --> ', filterObj);

  let queryStr = JSON.stringify(filterObj);
  // object to string "{"property":"value"}"
  console.log('queryStr Before --> ', queryStr);

  queryStr = queryStr.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`,
  );
  console.log('queryStr After --> ', queryStr);

  // let query = Product.find(JSON.parse(queryStr));
  query = query.find(JSON.parse(queryStr));
  console.log('query --> ', query);

  // 2. Sorting

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    console.log('sortBy --> ', sortBy);
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  const products = await query;
  return res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products,
    },
  });
});
