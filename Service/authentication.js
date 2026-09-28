const jwt=require("jsonwebtoken");
async function generateToken(user){
    const payload={id:user._id,username:user.username,email:user.email}
    const token= jwt.sign(payload, process.env.JWT_SECRET);
    return token;
}

   async function verifyToken(token) {
    try {
       
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
        return decoded;
    } catch (err) {
        return null;
    }
}
    module.exports={generateToken,verifyToken};