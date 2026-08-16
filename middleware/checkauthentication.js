const {generateToken,verifyToken}=require('../Service/authentication.js');
async function checkAuthentication(req, res, next) {
    const token = req.cookies.token;
    
    if (!token) {
        req.user = null;
        return res.redirect('/login');
    }
    try {
        const decoded=await verifyToken(token);
       
        req.user = decoded;
         if (!decoded) {
            return res.redirect('/login');
        }
        next();
    } catch (error) {
        req.user = null;
        return res.redirect('/login');
    }}

module.exports = checkAuthentication; 