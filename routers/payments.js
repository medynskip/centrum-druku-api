const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.get("/test"),
  (req, res) => {
    res.send("success");
  };

router.post("/create", (req, res) => {
  fetch("https://secure.snd.payu.com/api/v2_1/orders", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer 0bbb17f6f9f46f1c768648a21a47550d",
    },
    body: {
      ...req.body,
    },
  })
    .then((resp) => resp.json())
    .then((data) => {
      res.send(data);
    });
});

module.exports = router;
