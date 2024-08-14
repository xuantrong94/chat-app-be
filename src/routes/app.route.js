const express = require('express');
const router = express.Router();

const authRouter = require('./auth.route');
const userRouter = require('./user.route');
const conversationRouter = require('./conversation.route');
const productRouter = require('./product.route');

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/conversations', conversationRouter);
router.use('/products', productRouter);

module.exports = router;
