//import express
const express = require('express')

//init express router
const router = express.Router();

//import verifyToken
const verifyToken = require('../middlewares/auth');

//import register controller
const registerController = require('../controllers/registercontroller');

const loginController = require('../controllers/loginController');

const userController = require('../controllers/userControllers');

//import validate register
const { validateRegister, validateLogin } = require('../utils/validators/auth');

//define route for register
router.post('/register', validateRegister, registerController.register);

router.post('/login', validateLogin, loginController.login);

router.get('/admin/allusers', verifyToken, userController.allUsers);

//export router
module.exports = router