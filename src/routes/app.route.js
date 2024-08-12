const express = require('express');
const router = express.Router();

const authRouter = require('./auth.route');
const userRouter = require('./user.route');
const conversationRouter = require('./conversation.route');

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/conversations', conversationRouter);

module.exports = router;
