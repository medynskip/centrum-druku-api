import express from 'express';
const router = express.Router();

// const ProductSchema = require("../models/Product");
import Product from './../models/Product.js';
import PriceList from '../models/PriceList.js';

router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
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
}); 


router.get("/get/:id", async (req, res) => {
  const id = req.params.id;

  const resp = await Product.findById(id);

  res.json(resp);
});

router.put("/update/:id", async (req, res) => {
  const id = req.params.id;

  const resp = await Product.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
    }
  );

  res.json(resp);
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

/* PRICE LIST METHODS START*/
router.post("/add/pricelist", (req, res) => {
  const newPriceList = new PriceList({
    ...req.body,
  });

  newPriceList
    .save()
    .then((data) => {
      res.json(data);
      console.log(`Cennik dodany do bazy`);
    })
    .catch((err) => {
      res.status(404);
    });
});

router.put("/update/pricelist/:id", async (req, res) => {
  const id = req.params.id;

  const resp = await PriceList.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
    }
  );

  res.json(resp);
});

router.get("/get/pricelist/:productid", async (req, res) => {
  const productid = req.params.productid;

  const resp = await PriceList.findOne({
    productID: productid,
  });

  res.json(resp);
}); 


export default router;
