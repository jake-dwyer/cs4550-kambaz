import express from 'express';
import session from "express-session";
import "dotenv/config";
import UserRoutes from './Kambaz/Users/routes.js';
import Hello from "./Hello.js"
import cors from "cors";
import Lab5 from "./Labs/Lab5/index.js";

const app = express()
app.use(
    cors({
        credentials: true,
        origin:  process.env.NETLIFY_URL || "http://localhost:5173",
    })
);
const sessionOptions = {
    secret: process.env.SESSION_SECRET || "kambaz",
    resave: false,
    saveUninitialized: false,
  };
  if (process.env.NODE_ENV !== "development") {
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
      sameSite: "none",
      secure: true,
      domain: process.env.NODE_SERVER_DOMAIN,
    };
  }
app.use(session(sessionOptions));  
app.use(express.json());
const port = process.env.PORT || 4000;
UserRoutes(app);
Lab5(app)
Hello(app)
app.listen(port)
