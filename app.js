const express=require(`express`);
const  http=require(`http`);
const app=express();
const {Server}=require(`socket.io`);
const mongoose=require('mongoose');
const server=http.createServer(app);
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
app.get('/',checkauthentication,(req,res)=>{
    res.render(`home`);
});
app.get('/login',(req,res)=>{
    res.render(`login`);
});
app.get('/register',(req,res)=>{
    res.render(`registration`);
});
app.use('/user',userRouter);
server.listen(8000,()=>{
    console.log(`server is running on port 8000`);
});
