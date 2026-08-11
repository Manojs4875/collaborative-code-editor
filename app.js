const express=require(`express`);
const  http=require(`http`);
const app=express();
const {Server}=require(`socket.io`);
const server=http.createServer(app);
const io=new Server(server);
app.use(express.static(`public`));
app.get(`/`,(req,res)=>{
    res.sendFile(__dirname + `/public/index.html`)
});
const users = {};
io.on(`connection`,(socket)=>{
    socket.on('join', (username) => {
        users[username] = socket.id;
    });
    socket.on(`message`,(data)=>{
        const  { message, recipient, username }=data;
       socket.to(users[recipient]).emit(`message`,{message,username}); 
    });
    
});
server.listen(8000,()=>{
    console.log(`server is running on port 8000`);
});
