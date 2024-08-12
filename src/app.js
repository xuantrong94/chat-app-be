const express = require('express');
const http = require('http');

const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const mongoSanitizer = require('express-mongo-sanitize');
const compression = require('compression');
const cookieParser = require('cookie-parser');

require('dotenv').config();
const socketIo = require('socket.io');

const socketManager = require('./services/socketManager.service');
const globalErrorHandler = require('./controllers/error.controller');
const appRoutes = require('./routes/app.route');

const app = express();

const server = http.createServer(app);
const io = socketIo(server);

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again later',
});

//* development environment
app.use(morgan('dev'));

//* app optimize
app.use(compression());

//* security middlewares
app.use(helmet());
app.use('/api', limiter);
app.use(
  hpp({
    whitelist: ['http://localhost:3000', 'https://my-website.com'], // allow requests from these origins
    disable: process.env.NODE_ENV === 'development', // disable in development environment
  }),
);
app.use(mongoSanitizer());

//* parse request body middlewares
app.use(express.json({ limit: '10kb' }));
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(cookieParser());

//* init database
require('./database/init.mongodb');

//* routes
app.use('/api/v1', appRoutes);

//* error handling middleware
app.use(globalErrorHandler);

//* socket.io
socketManager(io);

module.exports = app;
