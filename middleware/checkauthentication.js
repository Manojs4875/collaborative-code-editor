const {verifyToken}=require('../Service/authentication.js');
function checkAuthentication(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/login');
    }
    try {
        const decoded=verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.redirect('/login');
    }}

module.exports = checkAuthentication; 