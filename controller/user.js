const User = require('../models/user.js');
const { generateToken,verifyToken } =require('../Service/authentication.js'); 
const bcrypt= require('bcrypt');
async function handleRegister(req, res) {
    const { username, email, password } = req.body;
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);
    const user = await User.create({ username, email, password: hashedPassword });
    const token =await generateToken(user);
    res.cookie('token', token,);
    res.redirect('/editor');
}
async function handlelogin(req, res) {
    const { username, password } = req.body;
    if(!username || !password) {
        
        return res.render('login', { error: 'Username and password are required' });
    }
    const user= User.findOne({ username: username, password: password });
    if (!user) {
        return res.render('login', { error: 'Invalid username or password' });
    }
    const token =await generateToken(user);
    res.cookie('token', token,);
    return res.redirect('/editor');
}
module.exports = { handleRegister, handlelogin };
