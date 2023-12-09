import express from "express";
import DB from "./db/conf/db.conf";
const PORT = 3000;
const app = express();

//db connection
DB.authenticate()
  .then(() => {
    console.log("auth: ok");
  })
  .catch(() => {
    console.log("auth: failed");
  });
DB.sync({ force: true })
  .then(() => {
    console.log("sync: ok");
  })
  .catch(() => {
    console.log("sync: failed");
  });
  
app.use(express.json());

app.listen(PORT, () => {
  console.log("Co-Lab open at port: %d", PORT);
});
