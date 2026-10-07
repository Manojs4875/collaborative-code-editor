const express = require(`express`);
const http = require(`http`);
require("dotenv").config();
const app = express();
const Project = require('./models/project.js')
const { Server } = require(`socket.io`);
const mongoose = require('mongoose');
const server = http.createServer(app);
const projectRouter = require(`./router/project.js`);
const io = new Server(server);
const userRouter = require(`./router/user.js`);
const cookie = require(`cookie-parser`);
const checkauthentication = require(`./middleware/checkauthentication.js`);
const RGA=require(`./Crdt/rga.js`);
app.use(express.static(`public`));
app.use(cookie());
app.set(`view engine`, `ejs`);
app.set(`views`, `views`);
app.use(express.static(`public`));
app.use(express.json());
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Database connected");
}).catch((err) => {
    console.log(err);
});
app.use(express.urlencoded({ extended: true }));
const fileUsers = {};
let applyingRemoteOperation = false;

io.on("connection", (socket) => {

    socket.on("join-file", (data) => {
         console.log("Client connected:", socket.id);
        const { fileId, username } = data;
        socket.join(fileId);
        if (!fileUsers[fileId]) {
            fileUsers[fileId] = [];
        }

        fileUsers[fileId].push({
            socketId: socket.id,
            username: username
        });

        io.to(fileId).emit("user-joined",
            fileUsers[fileId], 
        );
    });
    socket.on("crdt-operations", (data) => {
        console.log("Received CRDT operations:", data.operations);
         
        setTimeout(() => {
        socket.to(data.fileId).emit(
            "crdt-operation",
            data.operations
        ); 
    }, 5);
       
           
        
    }),
    socket.on("disconnect", () => {

        for (const fileId in fileUsers) {

            fileUsers[fileId] = fileUsers[fileId].filter(
                user => user.socketId !== socket.id
            );

            io.to(fileId).emit(
                "users-in-file",
                fileUsers[fileId]
            );
        }

    });

});

app.get('/', checkauthentication, async (req, res) => {
    // display all projects for the logged-in user
    const projects = await Project.find({
    $or: [
        { owner: req.user.id },
        { collaborators: req.user.id }
    ]
    });
    res.render(`home`, { projects });
});
app.get('/login', (req, res) => {
    res.render(`login`);
});
app.get('/register', (req, res) => {
    res.render(`registration`);
});
app.use('/project', checkauthentication, projectRouter);
app.use('/user', userRouter);
server.listen(8000, () => {
    console.log(`server is running on port 8000`);
});
