import cors from "cors";
import express from "express";
import authRoute from "./routes/auth.js";
import { initaliseDb } from "./utils/utils.js";
import { PORT } from "./utils/secret.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initaliseDb();

app.use("/auth", authRoute);

app.use("/", (req, res) => res.status(404).send("Invalid path"));

app.listen(PORT, () => {
  console.log(`Backend is up at : ${PORT}`);
});
