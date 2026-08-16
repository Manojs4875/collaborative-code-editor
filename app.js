const express=require(`express`);
const  http=require(`http`);
const app=express();
const Project=require('./models/project.js')
const {Server}=require(`socket.io`);
const mongoose=require('mongoose');
const server=http.createServer(app);
const projectRouter=require(`./router/project.js`);
const io=new Server(server);
const userRouter=require(`./router/user.js`);
const cookie=require(`cookie-parser`);
const checkauthentication=require(`./middleware/checkauthentication.js`);
app.use(cookie());
app.set(`view engine`,`ejs`);
app.set(`views`,`views`);
app.use(express.static(`public`));
app.use(express.json());
mongoose.connect('mongodb://localhost:27017/ChatApp').then(()=>{
    console.log("Database connected");
}).catch((err)=>{
    console.log(err);
});
app.use(express.urlencoded({extended:true}));
io.on("connection", (socket) => {

    socket.on("join-file", (fileId) => {
        socket.join(fileId);

        console.log("User joined file:", fileId);
    });
    socket.on("code-change", (data) => {

    socket.to(data.fileId).emit("code-change", {
        content: data.content
    });

});

});

app.get('/',checkauthentication,async (req,res)=>{
   
    const projects = await Project.find({
    owner: req.user.id
});
    res.render(`home`,{projects});
});
app.get('/login',(req,res)=>{
    res.render(`login`);
});
app.get('/register',(req,res)=>{
    res.render(`registration`);
});
app.use('/project',checkauthentication,projectRouter);
app.use('/user',userRouter);
server.listen(8000,()=>{
    console.log(`server is running on port 8000`);
});
