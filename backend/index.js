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
import cron from "node-cron";
// import { checkAndSendNotifications } from "./emailNotifications.js";
import schedule from "node-schedule";

const app = express();

// Required on Render: so req.secure is true (cookie with Secure flag gets set)
app.set("trust proxy", 1);

const port = process.env.PORT || 3000;
const YEAR_TO_MILLISECOND_CONVERTION_FACTOR = 365 * 24 * 60 * 60 * 1000;
env.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
const SequelizeStore = SequelizeStoreInit(session.Store);
const sessionStore = new SequelizeStore({
  db: sequelize,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const allowedOrigins = [
  "http://localhost:5173",
  "https://heno-1p67.onrender.com", // production frontend on Render
  ...(process.env.FRONTEND_ORIGIN ? process.env.FRONTEND_ORIGIN.split(",").map((o) => o.trim()) : []),
].filter(Boolean);
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) cb(null, true);
      else cb(null, false);
    },
    credentials: true,
  })
);
// Use cross-origin cookies when frontend is on a different origin (e.g. localhost → Render).
// Set COOKIE_CROSS_ORIGIN=true in Render Environment so session works from your frontend.
const cookieCrossOrigin =
  process.env.COOKIE_CROSS_ORIGIN === "true" ||
  process.env.NODE_ENV === "production";
app.use(
  session({
    secret: process.env.SESSION_SECRET || "TOPSECRETWORD",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      sameSite: cookieCrossOrigin ? "none" : "lax",
      secure: cookieCrossOrigin,
      expires: new Date(Date.now() + YEAR_TO_MILLISECOND_CONVERTION_FACTOR),
    },
  })
);

const job = schedule.scheduleJob("0 0 * * *", () => {
  // checkAndSendNotifications();
});

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
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

  socket.on("joinUserRoom", (userId) => {
    socket.join(`user:${userId}`);
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
