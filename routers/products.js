import express from 'express';
const router = express.Router();

// const ProductSchema = require("../models/Product");
import Product from './../models/Product.js';

router.delete("/delete/:id", async (req, res) => {
  var id = req.params.id;
  const resp = await Product.deleteOne(
    {
      _id: id,
    }
  );

  res.json(resp);
});

router.get("/get", async (req, res) => {
  const resp = await Product.find();

  res.json(resp);
});

router.get("/get/active", async (req, res) => {
  const resp = await Product.find({
    active: true,
  });

  res.json(resp);
  // Product.find(
  //   {
  //     active: true,
  //   },
  //   (err, data) => {
  //     if (err) return console.log(err);
  //     res.json(data);
  //   }
  // );
}); 

router.get("/get/:id", (req, res) => {
  var id = req.params.id;
  Product.findById(id, (err, data) => {
    if (err) return console.log(err);
    res.json(data);
  });
});

router.put("/update/:id", (req, res) => {
  var id = req.params.id;
  Product.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
      useFindAndModify: false,
    },
    (err, data) => {
      if (err) return console.log(err);
      res.json(data);
    }
  );
});

router.post("/add", (req, res) => {
  const newProduct = new Product({
    ...req.body,
  });

  newProduct
    .save()
    .then((data) => {
      res.json(data);
      console.log(`Wpis dodany do bazy`);
    })
    .catch((err) => {
      res.status(404);
    });
});

export default router;
