import 'dotenv/config';
import express from 'express';

const app = express();
const port = process.env.PORT || 5001;
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';


import { fileURLToPath } from 'url';
//routes import
import productRouter from './routers/products.js';
import postsRouter from './routers/posts.js';
import ordersRouter from './routers/orders.js';
import usersRouter from './routers/users.js';
import filesRouter from './routers/files.js';
import pagesRouter from './routers/pages.js';
import paymentRouter from './routers/payments.js';
import configurationRouter from './routers/configuration.js';

// const productRouter = require("./routers/products");
// const postsRouter = require("./routers/posts");
// const ordersRouter = require("./routers/orders");
// const usersRouter = require("./routers/users");
// const filesRouter = require("./routers/files");
// const pagesRouter = require("./routers/pages");
// const paymentRouter = require("./routers/payments");
// const configurationRouter = require("./routers/configuration");

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
app.use("/public", express.static(path.join(__dirname + "/public")));

app.use(express.json());

app.use(cors());

//routes assign
app.use("/product", productRouter);
app.use("/blog", postsRouter);
app.use("/order", ordersRouter);
app.use("/user", usersRouter);
app.use("/file", filesRouter);
app.use("/page", pagesRouter);
app.use("/payment", paymentRouter);
app.use("/configuration", configurationRouter);

//connect to db
mongoose.connect(
  process.env.DB_CONNECTION,
  // process.env.DB_CONNECTION,
  // {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  //   useCreateIndex: true,
  // }
);

app.listen(port, () =>
  console.log(`Centrum Druku server started on port ${port}`)
);
