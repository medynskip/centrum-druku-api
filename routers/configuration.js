
import express from 'express';
const router = express.Router();

// const Configuration = require("../models/Configuration");

import ConfigurationSchema from '../models/Configuration.js';

// Get configuration
router.get("/get", (req, res) => {
  Configuration.find({}, (err, data) => {
    if (err) return console.log(err);
    res.json(data);
  });
});

router.post("/set", (req, res) => {
  if (req.body._id == "") {
    const temp = { ...req.body };
    delete temp._id;
    const newConfig = new Configuration({
      ...temp,
    });
    newConfig
      .save()
      .then((data) => res.json(data))
      .catch((err) => res.status(404));
  } else {
    ConfigurationSchema.findByIdAndUpdate(
      req.body._id,
      req.body,
      {
        new: true,
        useFindAndModify: false,
      },
      (err, data) => {
        if (err) return console.log(err);
        return res.json(data);
      }
    );
  }
});

export default router;
