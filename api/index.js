require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan")
const db = require("./src/db/db");
const routes = require("./src/api/index")
const app = express();

const PORT = process.env.PORT || 5000;



app.use(cors({ origin: "*" }));
app.use(express.json());

// HTTP request logger
app.use(morgan("dev"));


app.use(
  express.urlencoded({
    extended: true,
  })
);

// Route
routes(app)




// Health Route
app.get("/", async (req, res) => { res.json("Server is running")});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server Running on Port : ${PORT}`);
});