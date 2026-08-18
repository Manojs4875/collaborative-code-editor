const express = require(`express`);
const http = require(`http`);
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
app.use(cookie());
app.set(`view engine`, `ejs`);
app.set(`views`, `views`);
app.use(express.static(`public`));
app.use(express.json());
mongoose.connect('mongodb://localhost:27017/ChatApp').then(() => {
    console.log("Database connected");
}).catch((err) => {
    console.log(err);
});
app.use(express.urlencoded({ extended: true }));
const fileUsers = {};
io.on("connection", (socket) => {

    socket.on("join-file", (data) => {
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
    socket.on("code-change", (data) => {

        socket.to(data.fileId).emit("code-change", {
            content: data.content
        });

    });
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

    const projects = await Project.find({
        owner: req.user.id
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
