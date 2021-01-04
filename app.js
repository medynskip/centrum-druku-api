require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 5001;
const mongoose = require("mongoose");
var path = require("path");
const cors = require("cors");

//routes import
const productRouter = require("./routers/products");
const postsRouter = require("./routers/posts");
const ordersRouter = require("./routers/orders");
const usersRouter = require("./routers/users");

app.use("/public", express.static(path.join(__dirname + "/uploads")));

app.use(express.json());

app.use(cors());

//routes assign
app.use("/product", productRouter);
app.use("/blog", postsRouter);
app.use("/order", ordersRouter);
app.use("/user", usersRouter);

//connect to db
mongoose.connect(
  process.env.DB_CONNECTION,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  () => {
    console.log("connected to CENTRUM_DRUKU db");
  }
);

app.listen(port, () =>
  console.log(`Centrum Druku server started on port ${port}`)
);
