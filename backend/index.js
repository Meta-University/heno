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
import axios from "axios";

const app = express();
const port = 3000;
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
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  })
);

sessionStore.sync();
app.use(router);
app.use(projectRouter);
app.use(taskRouter);

app.get("/api/images", async (req, res) => {
  const { query } = req.query;

  // try {
  const response = await axios.get("https://api.pixels.com/v1/search", {
    headers: {
      Authorization: process.env.API_KEY,
    },
    params: {
      query,
      per_page: 1,
    },
  });
  console.log(response);
  res.json(response.data);

  // } catch (error) {
  //   res.status(500).json({ error: "Err9r fetching images" });
  // }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
