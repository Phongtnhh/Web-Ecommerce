const express = require('express')
const mongoose = require('mongoose');
const route = require("./api/routes/client/index.route")

const app = express()
const port = 3000

route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

