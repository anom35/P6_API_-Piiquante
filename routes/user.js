const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

// route pour la création d'utilisateur ou le login
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
