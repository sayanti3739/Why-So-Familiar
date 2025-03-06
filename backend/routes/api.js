const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const verifyJWT = require('../middleware/verifyJWT');

router.get('/get-token', verifyJWT, apiController.getToken);

module.exports = router;
