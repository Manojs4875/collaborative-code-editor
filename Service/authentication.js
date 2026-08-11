const jwt=require("jsonwebtoken");
const secretKey="Hi@HK0915";
async function generateToken(user){
    const payload={id:user._id,username:user.username,email:user.email}
    const token=jwt.sign(payload,secretKey,{expiresIn:"10m"})
    return token;
}
async function verifyToken(token){
    try{
        const decoded=jwt.verify(token,secretKey);
        return decoded;
    }catch(err){
        throw new Error("Invalid token");
    }}
    module.exports={generateToken,verifyToken};