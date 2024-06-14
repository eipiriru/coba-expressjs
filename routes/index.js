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
const { validateUser } = require('../utils/validators/user');

//define route for register
router.post('/register', validateRegister, registerController.register);

router.post('/login', validateLogin, loginController.login);

router.get('/admin/allusers', verifyToken, userController.allUsers);
router.post('/admin/createuser', verifyToken, validateUser, userController.createUser);
router.get('/admin/getuserbyid/:id', verifyToken, userController.getUserbyId);

//export router
module.exports = router