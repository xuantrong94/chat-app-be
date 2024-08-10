const AppError = require('../utils/appError');

//* Cast error handler
// Giả sử 'id' phải là một ObjectId
// User.findById('invalid-id');
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

//* Duplicate field error handler
// Giả sử 'email' là trường unique
// User.create({ email: 'existing@email.com' });
const handleDuplicateFieldsDB = (err) => {
  const value = err.msg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

//* Validation error handler
// Giả sử 'name' là trường required
// User.create({ email: 'test@email.com' }); // Thiếu trường 'name'
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

//* JWT error handler
// Sử dụng token không hợp lệ
// jwt.verify('invalid-token', process.env.JWT_SECRET);
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

//* JWT expired error handler
// Sử dụng token đã hết hạn
// jwt.verify('expired-token', process.env.JWT_SECRET);
const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

//* Mongoose connection error handler
// Kết nối đến URL không tồn tại hoặc không thể truy cập
// mongoose.connect('mongodb://invalid-url/db');
const handleMongooseConnectionError = () =>
  new AppError(
    'Database connection error. Please try again later.',
    500,
  );

//* Mongoose document not found error handler
// Tìm document không tồn tại và sử dụng orFail()
// User.findById('nonexistent-id').orFail();
const handleDocumentNotFoundError = () =>
  new AppError('Document not found.', 404);

//* File upload error handler
const handleFileUploadError = () =>
  new AppError('File upload failed. Please try again.', 400);

//* Rate limit exceeded error handler
const handleRateLimitError = () =>
  new AppError(
    'Too many requests from this IP, please try again later.',
    429,
  );

//* CORS error handler
const handleCORSError = () =>
  new AppError('CORS error: Origin not allowed.', 403);

//* Default error handler for development
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

//* Default error handler for production
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  console.log('Error')
  return res.status(err.status || 500).json({
    status: err.status,
    message: err.message,
  })
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredError();
    if (error.name === 'MongooseServerSelectionError')
      error = handleMongooseConnectionError();
    if (error.name === 'DocumentNotFoundError')
      error = handleDocumentNotFoundError();
    if (error.name === 'MulterError') error = handleFileUploadError();
    if (error.name === 'RateLimitError')
      error = handleRateLimitError();
    if (error.name === 'CORSError') error = handleCORSError();

    sendErrorProd(error, res);
  }
};
