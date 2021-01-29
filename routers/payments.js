const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.get("/test", (req, res) => {
  console.log(req);
  console.log("info from PAYU");
  //   res.send("success");
});

const fecz = async () => {
  const query = await fetch(
    "https://secure.snd.payu.com/pl/standard/user/oauth/authorize",
    {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        process.env.CLIENT_ID +
        "&client_secret=" +
        process.env.CLIENT_SECRET,
    }
  );
  const token = await query.json();
  return token;
};

const payment = async (token, req) => {
  console.log(req.body);
  const query = await fetch("https://secure.snd.payu.com/api/v2_1/orders", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.access_token}`,
    },
    body: JSON.stringify(req.body),
  });
  console.log(query.headers);
  return query.url;
};

router.post("/create", async (req, res) => {
  const token = await fecz();
  //   console.log(token);
  const stream = await payment(token, req);
  res.json({ url: stream, success: "OK" });
});

module.exports = router;
