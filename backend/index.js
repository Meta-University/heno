import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import env from "dotenv";
import session from "express-session";
import router from "./routes/users.js";
import projectRouter from "./routes/projects.js";
import Sequelize from "sequelize";
import SequelizeStoreInit from "connect-session-sequelize";
import taskRouter from "./routes/tasks.js";
import reorganiseRouuter from "./reorganise.js";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import notificationRouter from "./routes/notifications.js";
import recommendRouuter from "./recommend.js";

const app = express();

const port = 3000;
const YEAR_TO_MILLISECOND_CONVERTION_FACTOR = 365 * 24 * 60 * 60 * 1000;
env.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
});
const SequelizeStore = SequelizeStoreInit(session.Store);
const sessionStore = new SequelizeStore({
  db: sequelize,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(
  session({
    secret: "TOPSECRETWORD",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      sameSite: false,
      secure: false,
      expires: new Date(Date.now() + YEAR_TO_MILLISECOND_CONVERTION_FACTOR),
    },
  })
);

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

sessionStore.sync();
app.use(router);
app.use(projectRouter);
app.use(reorganiseRouuter);
app.use(notificationRouter);
app.use(taskRouter);
app.use(recommendRouuter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  socket.emit("notification", { messagee: `Welcome to heno` });

  socket.on("joinTask", (taskId) => {
    socket.join(`task:${taskId}`);
  });

  socket.on("leaveTask", (taskId) => {
    socket.leave(`task:${taskId}`);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected ", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export { io };
