const express = require('express');
const path = require("path");
const database = require("./config/database");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("express-flash");
require("dotenv").config();

const app = express()
const port = process.env.PORT;

const route = require("./api/routes/client/index.route");
const routeadmin = require("./api/routes/admin/index.route");

database.connect();

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

