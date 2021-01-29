const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.get("/test", (req, res) => {
  res.send("success");
});

// const fecz = () => {
//   fetch("https://secure.snd.payu.com/api/v2_1/orders", {
//     method: "post",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: "Basic 0bbb17f6f9f46f1c768648a21a47550d",
//     },
//     body: {
//       ...req.body,
//     },
//   })
//     .then((resp) => resp.json())
//     .then((data) => {
//       //   return data;
//       res.send(data);
//     });
// };

const fecz = async () => {
  const creds = {
    grant_type: "client_credentials",
    client_id: "402969",
    client_secret: "e33935a34d7b16618db8a73009fcfd27",
  };
  const query = await fetch(
    "https://secure.snd.payu.com/pl/standard/user/oauth/authorize",
    {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      // data: JSON.stringify(creds),
      // data: creds,
      body:
        "grant_type=client_credentials&client_id=" +
        creds.client_id +
        "&client_secret=" +
        creds.client_secret,
    }
  );
  const token = await query.json();
  return token;
};

const payment = async (token, req) => {
  const query = await fetch("https://secure.snd.payu.com/api/v2_1/orders", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.access_token}`,
    },
    body: JSON.stringify(req.body),
  });
  //   const resp = await query.json();
  return query.url;
};

router.post("/create", async (req, res) => {
  const token = await fecz();
  //   const stream = await payment(token, req);
  //   console.log(stream);
  res.json({ token: token, success: "OK" });
  //   res.json({ url: stream, success: "OK" });
  //   const data = { ...req.body };
  //   fetch("https://secure.snd.payu.com/api/v2_1/orders", {
  //     method: "post",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token.access_token}`,
  //     },
  //     // body: req.body,
  //     body: JSON.stringify(req.body),
  //   })
  //     // .then((resp) => resp.body.json())
  //     .then((dats) => {
  //       console.log(dats);
  //       res.json(dats);
  //       //   res.send(dats);
  //     });
  //   res.send(token);
  //   const creds = {
  //     grant_type: "client_credentials",
  //     client_id: "402972",
  //     client_secret: "40d4c2430c73e528c395d9d73f594766",
  //   };
  //   fetch("https://secure.snd.payu.com/pl/standard/user/oauth/authorize", {
  //     method: "post",
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //     body:
  //       "grant_type=client_credentials&client_id=" +
  //       creds.client_id +
  //       "&client_secret=" +
  //       creds.client_secret,
  //   })
  //     .then((resp) => resp.json())
  //     .then((data) => {
  //       res.send(data);
  //     });
});

module.exports = router;
