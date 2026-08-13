const express=require('express');
const checkAuthentication=require('../middleware/checkauthentication.js');
const router=express.Router();
const {createProject}=require('../controller/project.js');
router.post('/',checkAuthentication,createProject);
module.exports=router;
