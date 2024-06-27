import express from "express";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import env from "dotenv";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import router from "./routes/users.js";
import Sequelize from "sequelize";
import SequelizeStoreInit from "connect-session-sequelize";

const app = express();
const port = 3000;
const prisma = new PrismaClient();
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

// app.use(passport.initialize());
// app.use(passport.session());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
