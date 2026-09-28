const {handleRegister, handlelogin} = require('../controller/user.js');
const router = require('express').Router();
router.post('/register', handleRegister);
router.post('/login', handlelogin); 
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.render('login', { message: 'Logged out successfully' });
});
module.exports = router; 