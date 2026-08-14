const Project=require("../models/project.js");
const File = require("../models/file");
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
async function getProject(req, res) {
    const projectId = req.params.id;

    const project = await Project.findById(projectId);

    if (!project) {
        return res.status(404).send("Project not found");
    }
    const files = await File.find({
    project: projectId
});
    res.render("project", {
        project,
        files
    });
}
async function createFile(req, res) {

    const projectId = req.params.id;
    const { name } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
        return res.status(404).send("Project not found");
    }

    const file = await File.create({
        name: name,
        project: projectId
    });

    res.redirect(`/project/${projectId}`);
}
async function getFile(req, res) {
    const { projectId, fileId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
        return res.status(404).send("Project not found");
    }

    const file = await File.findById(fileId);

    if (!file) {
        return res.status(404).send("File not found");
    }

    res.render("file", {
        project,
        file
    });
}
async function updateFile(req, res) {

    const { projectId, fileId } = req.params;
    const { content } = req.body;

    await File.findByIdAndUpdate(fileId, {
        content: content
    });

    res.redirect(`/project/${projectId}/file/${fileId}`);
}
module.exports={createProject,getProject,createFile,getFile,updateFile};