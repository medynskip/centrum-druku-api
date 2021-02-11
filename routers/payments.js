const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const Order = require("../models/Order");

router.post("/update-status/:id", async (req, res) => {
  console.log("info from PAYU");
  const entry = {
    date: Date.now(),
    comment: `Aktualizacja płatności PayU: ${req.body.order.status}`,
  };
  const id = req.body.order.extOrderId;
  Order.findByIdAndUpdate(
    id,
    { $push: { history: entry }, paymentStatus: req.body.order.status },
    {
      new: true,
      useFindAndModify: false,
    },
    (err, data) => {
      if (err) return console.log(err);
    }
  );
  res.sendStatus(200);
});

const getToken = async () => {
  const query = await fetch(
    "https://secure.snd.payu.com/pl/standard/user/oauth/authorize",
    {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=402972&client_secret=40d4c2430c73e528c395d9d73f594766",
    }
  );
  const token = await query.json();
  console.log("token", token);
  return token;
};

const getPaymentUrl = async (token, req) => {
  const query = await fetch("https://secure.snd.payu.com/api/v2_1/orders", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.access_token}`,
    },
    body: JSON.stringify(req.body),
  });
  //   console.log(query);
  return query.url;
};

router.post("/create/:id", async (req, res) => {
  const id = req.params.id;
  const token = await getToken();
  const stream = await getPaymentUrl(token, req);
  const entry = {
    date: Date.now(),
    comment: `Wybrano metodę płatności -PayU- oraz rozpoczęto proces płatności`,
  };
  Order.findByIdAndUpdate(
    id,
    {
      $push: { history: entry },
      paymentType: "PayU",
      paymemtStarted: Date.now(),
    },
    {
      new: true,
      useFindAndModify: false,
    },
    (err, data) => {
      if (err) return console.log(err);
    }
  );
  res.json({ url: stream, success: "OK" });
});

module.exports = router;
