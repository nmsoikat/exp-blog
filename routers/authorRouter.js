const router = require('express').Router()

const {
  authorGetController
} = require('../controllers/authorController');

router.get('/:authorId', authorGetController)

module.exports = router;