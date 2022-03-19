const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs");
const mongoose = require("mongoose");

//for ENV variables
require("dotenv").config();

const app = express();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB ERROR", err.message));

//apply middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes

fs.readdirSync("./routes").map((route) =>
  app.use("/api", require(`./routes/${route}`))
);

//port
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`app running on ${port}`));
