const Project=require("../models/project.js");
async function createProject(req, res){
   
    const {name}=req.body;
    if(!name){
        return res.render(`home`,{error:`Project name is required`});
    }
    console.log("REQ.USER =", req.user);
console.log("USER ID =", req.user?.id);
    const proj=await Project.create({
        name:name,
        owner:req.user.id
    })
    return res.redirect(`/project/${proj._id}`);

}
module.exports={createProject};