//imported modules
require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./models");
const router = require("./routes/routes.js");

//set view engine, static folder, & get data
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.set("views", "./views");

//call routes
app.use(router);

//connect to database and localhost
const PORT = process.env.PORT || 3000;
db.sequelize
  .sync({
    // force: true,
  })
  .then(() => {
    console.log("Database Connected");
    app.listen(PORT, () => {
      console.log("===============================================");
      console.log(`Server is Listening to http://localhost:${PORT}`);
      console.log("===============================================");
    });
  })
  .catch((error) => {
    console.log(error);
  });