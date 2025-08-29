require("dotenv").config();
const express = require("express");
const serverConfig = require("./config/serverConfig");

const PORT = process.env.PORT || 3000;

const app = express();

serverConfig(app);

app.listen(PORT, () => {
  console.log(`Example server started on port http://localhost:${PORT}`);
});




// const path = require('path');
// require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
// const express = require("express");
// const serverConfig = require("./config/serverConfig");
// const indexRouter = require("./routes/index.routes");

// const app = express();

// serverConfig(app);

// const PORT = process.env.PORT || 3000;

// app.use("/api", indexRouter);

// app.listen(PORT, () => {
//   console.log(`Example server started on port http://localhost:${PORT}`);
// });