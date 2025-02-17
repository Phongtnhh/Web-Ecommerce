const express = require('express')
const database = require("./config/database");
require("dotenv").config();
const route = require("./api/routes/client/index.route")

database.connect();

const app = express()
const port = process.env.PORT;

route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

