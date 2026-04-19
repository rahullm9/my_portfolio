const express = require('express');
const router = express.Router();
const { getComments, addComment } = require('../controllers/guestbookController.cjs');

router.route('/')
  .get(getComments)
  .post(addComment);

module.exports = router;
