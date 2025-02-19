const express = require('express')
const database = require("./config/database");
const bodyParser = require("body-parser");
require("dotenv").config();


const route = require("./api/routes/client/index.route");
const routeadmin = require("./api/routes/admin/index.route");

database.connect();

const app = express()
const port = process.env.PORT;

app.use(bodyParser.json());  // Thêm cái này để parse JSON
app.use(bodyParser.urlencoded({ extended: true }));

route(app);
routeadmin(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

