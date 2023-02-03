import cors from "cors";
import express, { Request, Response } from "express";

const app = express();
app.use(cors());

app.get("/status", (req, res) => {
  res.sendStatus(200);
});

app.post("/login", (req, res) => {
  res.sendStatus(200);
});

app.get("/token", (req, res) => {
  res.sendStatus(200);
});

app.listen(5000, () => {
  console.log("Running on 5000");
});