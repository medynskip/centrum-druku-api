import express from 'express';
const router = express.Router();

// const ProductSchema = require("../models/Product");
import ProductSchema from './../models/Product.js';

router.delete("/delete/:id", function (req, res) {
  var id = req.params.id;
  ProductSchema.deleteOne(
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
  ProductSchema.find({}, (err, data) => {
    if (err) return console.log(err);
    res.json(data);
  });
});

router.get("/get/active", (req, res) => {
  ProductSchema.find(
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
  ProductSchema.findById(id, (err, data) => {
    if (err) return console.log(err);
    res.json(data);
  });
});

router.put("/update/:id", (req, res) => {
  var id = req.params.id;
  ProductSchema.findByIdAndUpdate(
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
  const newProduct = new ProductSchema({
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
// module.exports = router;
