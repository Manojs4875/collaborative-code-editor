const Project=require("../models/project.js");
async function createProject(req, res){
    //create
    await Project.create({
        name:Project.name,
        owner:req.user._id
    })
    return res.redirect(`/project/${Project._id}`);

}
module.exports={createProject};