import express from 'express';
const router = express.Router();

// const ProductSchema = require("../models/Product");
import Product from './../models/Product.js';

router.delete("/delete/:id", function (req, res) {
  var id = req.params.id;
  Product.deleteOne(
    {
      _id: id,
    },
    function (err) {
      if (err) return console.log(err);
      res.status(200).end();
    }
  );
});

router.get("/get", (req, res) => {
  Product.find({}, (err, data) => {
    if (err) return console.log(err);
    res.json(data);
  });
});

router.get("/get/active", (req, res) => {
  Product.find(
    {
      active: true,
    },
    (err, data) => {
      if (err) return console.log(err);
      res.json(data);
    }
  );
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

  console.log('REQ', req.body);
  const newProduct = new Product({
    ...req.body,
    // name: "BABABBA"
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
// module.exports = router;
