const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const { connect } = require("mongoose");
require("dotenv").config();
// require('@dotenvx/dotenvx').config();
// const cors = require('cors');

connectDb();
const app = express();

// app.use(cors());

const port = process.env.PORT || 5000;

//adding a middleware
app.use(express.json());
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));