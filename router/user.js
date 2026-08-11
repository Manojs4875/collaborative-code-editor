const {handleRegister, handlelogin} = require('../controller/user.js');
const router = require('express').Router();
router.post('/register', handleRegister);
router.post('/login', handlelogin); 
module.exports = router; 