const express = require("express");
const fs = require("fs");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const pdf = require("./../utils/pdf");
const nodemailer = require("nodemailer");

const Order = require("../models/Order");

// default nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "centrumdruku.online@gmail.com",
    pass: process.env.APP_PASSWORD,
  },
});

// default nodemailer mailoptions
const generateMailOptions = (email, order_id) => {
  return {
    from: "Powiadomienie Centrum Druku <notyfikacje@centrumdruku.online>",
    to: `${email}`,
    subject: `Przyjęliśmy do realizacji zamówienie nr: ${order_id}`,
    text: `Twoje zamówienie nr ${order_id} zostało przyjęte do realizacji. `,
    html: `<b>Twoje zamówienie nr ${order_id} zostało przyjęte do realizacji.</b><br />Przejdz na strone http://centrumdruku.online/zamowienie/wyszukaj aby sprawdzic jego status.`,
  };
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = `./public/orders/${req.body.order}`;
    fs.exists(dir, (exists) => {
      if (!exists) {
        return fs.mkdir(dir, (err) => cb(err, dir));
      }
      return cb(null, dir);
    });
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

function getDirectoryFiles(directory, folder) {
  return new Promise(function (resolve, reject) {
    const fileList = [];
    fs.readdir(directory, function (err, files) {
      if (err) {
        reject(console.log("Unable to scan directory: " + err));
      }
      files.forEach(function (file) {
        fileList.push(`/${folder}/${file}`);
      });
      resolve(fileList);
    });
  });
}

// ROUTES BELOW

// Get all orders
router.get("/get", (req, res) => {
  Order.find({}, (err, data) => {
    if (err) return console.log(err);
    res.json(data);
  }).sort({
    placed: -1,
  });
});

// Get one order by id
router.get("/get/:id", (req, res) => {
  var id = req.params.id;
  Order.findById(id, (err, data) => {
    if (err) return console.log(err);
    res.json(data);
  });
});

// Get one order by id if correct email provided
router.get("/get/:id/:email", (req, res) => {
  var id = req.params.id;
  Order.findById(id, (err, data) => {
    if (err) return res.json({ msg: "BRAK ZAMOWIENIA", err: err });
    if (data.client.email == req.params.email) {
      return res.json(data);
    }
    res.json({
      msg: "NIEPRAWIDLOWY MAIL",
      err: "BLAD",
    });
  });
});

// Create new order
router.post("/add", upload.none(), (req, res) => {
  const newOrder = new Order({
    ...req.body,
  });
  newOrder
    .save()
    .then((data) => {
      const mailOptions = generateMailOptions(data.client.email, data._id);
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      res.json(data);
    })
    .catch((err) => res.status(404));
});

// Upload files and update order with file list
router.post("/update/files", upload.array("file"), (req, res) => {
  const id = req.body.order;
  const directoryPath = `./public/orders/${id}`;

  getDirectoryFiles(directoryPath, req.body.order).then((files) => {
    var id = req.body.order;
    Order.findByIdAndUpdate(
      id,
      { files: [...files] },
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
});

// Generate an invoice and update order entry
router.post("/update/invoice/:id", (req, res) => {
  const id = req.params.id;

  Order.findById(id, (err, data) => {
    if (err) return console.log(err);
    pdf.create(data, "VAT");
  }).then(
    Order.findByIdAndUpdate(
      id,
      {
        invoice: Date.now(),
      },
      {
        new: true,
        useFindAndModify: false,
      },
      (err, data) => {
        if (err) return console.log(err);
        res.json(data);
      }
    )
  );
});

// Generate a temp invoice and update order entry
router.post("/update/temp-invoice/:id", (req, res) => {
  const id = req.params.id;

  Order.findById(id, (err, data) => {
    if (err) return console.log(err);
    pdf.create(data, "temp");
  }).then(
    Order.findByIdAndUpdate(
      id,
      {
        invoiceTemp: Date.now(),
      },
      {
        new: true,
        useFindAndModify: false,
      },
      (err, data) => {
        if (err) return console.log(err);
        res.json(data);
      }
    )
  );
});

// Provide invoice data in response
router.get("/invoice/download/:id", (req, res) => {
  const id = req.params.id;
  const filePath = `./public/invoices/${id}/faktura-VAT.pdf`;
  res.download(filePath);
});

// Provide temp invoice data in response
router.get("/temp-invoice/download/:id", (req, res) => {
  const id = req.params.id;
  const filePath = `./public/invoices/${id}/pro-forma.pdf`;
  res.download(filePath);
});

// Update order by ID
router.put("/update/:id", (req, res) => {
  const id = req.params.id;
  Order.findByIdAndUpdate(
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
  Order.deleteOne(
    {
      _id: id,
    },
    function (err) {
      if (err) return console.log(err);
      res.status(200).end();
    }
  );
});

module.exports = router;
