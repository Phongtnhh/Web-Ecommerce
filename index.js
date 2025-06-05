const express = require('express');
const path = require("path");
const database = require("./config/database");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("express-flash");
const cors = require('cors');
require("dotenv").config();

const app = express();
const port = process.env.PORT;

const route = require("./api/routes/client/index.route");
const routeadmin = require("./api/routes/admin/index.route");

// Kết nối DB
database.connect();

// Cho phép CORS
app.use(cors());

// Parse JSON và url-encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cấu hình cookie và session đúng cách
app.use(cookieParser('toi<3em'));
app.use(session({
  secret: 'toi<3em',             // ✅ bắt buộc
  resave: false,                 // ✅ không lưu lại nếu không thay đổi
  saveUninitialized: true,       // ✅ lưu session chưa khởi tạo
  cookie: { maxAge: 60000 }      // 60 giây
}));
app.use(flash());

// Static files (nếu dùng)
app.use("/tinymce", express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// Routes
route(app);
routeadmin(app);

// 404 fallback
app.get("*", (req, res) => {
  res.status(404).json({ code: 404 });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening on port ${port}`);
});
