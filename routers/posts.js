import express from 'express';
const router = express.Router();

import PostSchema from '../models/Post.js';
// const PostSchema = require("../models/Post");

router.get("/get", (req, res) => {
  PostSchema.find({}, (err, data) => {
    if (err) return console.log(err);
    res.json(data);
  }).sort({
    added: -1,
  });
});

router.get("/get/active", (req, res) => {
  PostSchema.find(
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
  PostSchema.findById(id, (err, data) => {
    if (err) return console.log(err);
    res.json(data);
  });
});

router.post("/add", (req, res) => {
  const newPost = new PostSchema({
    title: req.body.title,
    added: Date.now(),
    author: req.body.author,
    image: req.body.image,
    tags: ["Druk", "Reklama"],
    content: req.body.content,
    active: req.body.active,
  });
  newPost
    .save()
    .then((data) => {
      res.json(data);
      console.log(`Wpis dodany do bazy`);
    })
    .catch((err) => {
      res.status(404);
    });
});

router.put("/update/:id", (req, res) => {
  var id = req.params.id;
  PostSchema.findByIdAndUpdate(
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
  PostSchema.deleteOne(
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