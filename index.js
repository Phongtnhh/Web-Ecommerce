const express = require('express');
const path = require("path");
const database = require("./config/database");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("express-flash");
const cors = require('cors');
require("dotenv").config();

const app = express()
const port = process.env.PORT;

const route = require("./api/routes/client/index.route");
const routeadmin = require("./api/routes/admin/index.route");

database.connect();

app.use(cors());
//flash
app.use(cookieParser('toi<3em'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// end flash

app.use("./tinymce", express.static(path.join(__dirname, 'node_modules', 'tinymce')));

app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: true }));


//ROutes
route(app);
routeadmin(app);
app.get("*", (req, res) => {
  res.json({
    code : 404,
  })
})

app.listen(port, "0.0.0.0",() => {
  console.log(`Example app listening on port ${port}`)
})

