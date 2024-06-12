import express from 'express';

const router = express.Router();

import PageSchema from '../models/Page.js';
// const PageSchema = require("../models/Page");

router.get("/get", (req, res) => {
  PageSchema.find({}, (err, data) => {
    if (err) return console.log(err);
    res.json(data);
  });
});

router.get("/get/active", (req, res) => {
  PageSchema.find(
    {
      active: true,
    },
    (err, data) => {
      if (err) return console.log(err);
      res.json(data);
    }
  ).sort({
    added: -1,
  });
});

router.get("/get/:id", (req, res) => {
  var id = req.params.id;
  PageSchema.findById(id, (err, data) => {
    if (err) return console.log(err);
    res.json(data);
  });
});

router.post("/add", (req, res) => {
  const newPage = new PageSchema({
    title: req.body.title,
    linkName: req.body.title,
    added: Date.now(),
    author: req.body.author,
    image: req.body.image,
    tags: ["Druk", "Reklama"],
    content: req.body.content,
    active: req.body.active,
  });
  newPage
    .save()
    .then((data) => res.json(data))
    .catch((err) => {
      res.status(404);
    });
});

router.put("/update/:id", (req, res) => {
  var id = req.params.id;
  PageSchema.findByIdAndUpdate(
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

router.delete("/delete/:id", function (req, res) {
  var id = req.params.id;
  PageSchema.deleteOne(
    {
      _id: id,
    },
    function (err) {
      if (err) return console.log(err);
      res.status(200).end();
    }
  );
});

export default router;