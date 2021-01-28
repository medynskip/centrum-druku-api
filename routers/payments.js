const express = require("express");
const router = express.Router();

router.post("/create", (req, res) => {
  fetch("https://secure.snd.payu.com/api/v2_1/orders", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer d65950f99775cbfe192d10ef6a64ab24",
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
