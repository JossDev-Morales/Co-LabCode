import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import DB from "./db/conf/db.conf";
import dotenv from "dotenv";
import process from "node:process";
import initRelations from "./db/initRelations";
import authRouter from './routes/auth.routes'
import errorHandlers from "./handlers/use.error.handlers";
dotenv.config();
const PORT = process.env.PORT??3000;
const app:Application = express();

//db connection

DB.authenticate()
  .then(() => {
    console.log("auth: ok");
  })
  .catch((e) => {
    console.log("auth: failed", e);
  });
DB.sync({ force: true })
  .then(() => {
    console.log("sync: ok");
  })
  .catch(() => {
    console.log("sync: failed");
  });

//db relations

initRelations();

//middlewares

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

//routers

app.use(authRouter)

//healthy status

app.get("/",(req,res)=>{
  res.sendStatus(200)
})
//errors
errorHandlers(app)
app.listen(PORT, () => {
  console.log("Co-Lab open at port: %d", PORT);
});
