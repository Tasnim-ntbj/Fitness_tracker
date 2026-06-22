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
//Increase limits to allow smooth transit of Base64 strings
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(bodyParser.json());
app.use(cors()); //allows calls from frontend to backend
app.use("/auth", AuthRouter);
app.use("/health", HealthRouter);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
