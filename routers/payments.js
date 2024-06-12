
import express from 'express';
const router = express.Router();

import fetch from 'node-fetch';

import OrderSchema from '../models/Order.js';
// const OrderSchema = require("../models/Order");

router.post("/update-status/:id", async (req, res) => {
  const entry = {
    date: Date.now(),
    comment: `Aktualizacja płatności PayU: ${req.body.order.status}`,
  };
  const id = req.body.order.extOrderId;
  OrderSchema.findByIdAndUpdate(
    id,
    {
      $push: { history: entry },
      paymentStatus: req.body.order.status,
      paymentCompleted:
        req.body.order.status == "COMPLETED" ? Date.now() : null,
    },
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
  OrderSchema.findByIdAndUpdate(
    id,
    {
      $push: { history: entry },
      paymentType: "PayU",
      paymentStarted: Date.now(),
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

export default router;