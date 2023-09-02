import express from "express";
import snippetRouter from "./snippetRouter.jsZ";

const app = express();
const apiRouter = express.Router();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

apiRouter.use("/snippet", snippetRouter);

app.use("/api/v1", apiRouter);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});