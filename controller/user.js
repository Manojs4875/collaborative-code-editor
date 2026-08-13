const User = require('../models/user.js');
const { generateToken, verifyToken } = require('../Service/authentication.js');
const bcrypt = require('bcrypt');
const Project = require('../models/project.js')
async function handleRegister(req, res) {
    const { username, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ username, email, password: hashedPassword });
    const token = await generateToken(user);

    res.redirect('/',);
}
async function handlelogin(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        console.log(user + "some");
        return res.render('login', { error: 'email and password are required' });
    }

    const user = await User.findOne({ email: email, });
    const isValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isValid) {
        console.log(user+"not valid")
        return res.render("login", {
            error: "Invalid email or password"
        });
    }
    if (!user) {
        console.log(user)
        return res.render('login', { error: 'email username or password' });
    }
    const token = await generateToken(user);
    res.cookie('token', token,);

    return res.redirect('/',);
}
module.exports = { handleRegister, handlelogin };
