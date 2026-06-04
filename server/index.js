const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const AuthRouter = require("./Routes/AuthRouter");
const HealthRouter = require("./Routes/HealthLogRouter");

require("dotenv").config();
require("./Models/db");

const PORT = process.env.PORT || 8080;
// testing
app.get("/ping", (req, res) => {
  res.send("PONG");
});

app.use(bodyParser.json());
app.use(cors());
app.use("/auth", AuthRouter);
app.use("/health", HealthRouter);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
