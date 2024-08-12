const express = require('express');
const router = express.Router();

const conversationController = require('../controllers/conversation.controller');
const authController = require('../controllers/auth.controller');

router.get('/', conversationController.getConversations);

router.use(authController.protect);
router
  .route('/')
  .post(conversationController.createConversation)
 

router
  .route(':/id')
  .patch(conversationController.updateConversation)
  .delete(conversationController.deleteConversation);

module.exports = router;
