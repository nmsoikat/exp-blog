const router = require('express').Router()
const {
  searchResultGetController
} = require('../controllers/searchResultController')

router.get('/', searchResultGetController)

module.exports = router;