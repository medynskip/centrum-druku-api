const express = require("express");
const fs = require("fs");
const router = express.Router();
const multer = require("multer");
var path = require("path");

const Order = require("../models/Order");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = `./uploads/${req.body.order_id}`;
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

router.get("/get", (req, res) => {
  Order.find({}, (err, data) => {
    if (err) return console.log(err);
    res.json(data);
  });
});

router.get("/get/:id", (req, res) => {
  var id = req.params.id;
  Order.findById(id, (err, data) => {
    if (err) return console.log(err);
    res.json(data);
  });
});

router.post("/add", upload.none(), (req, res) => {
  const newOrder = new Order({
    ...req.body,
    // status: "Nowe",
    // placed: Date.now(),
  });
  newOrder
    .save()
    .then((data) => res.json(data))
    .catch((err) => res.status(404));
});

//router.post("/add", upload.none(), (req, res) => {
//   const toJson = JSON.parse(req.body.order);
//   const newOrder = new Order({
//     ...toJson,
//     status: "Nowe",
//     placed: Date.now(),
//   });
//   newOrder
//     .save()
//     .then((data) => {
//       console.log(`Wpis dodany do bazy`, JSON.parse(data));
//       res.json(data);
//     })
//     .catch((err) => {
//       res.status(404);
//     });
// });

////////////////
// CO TO JEST //
////////////////
function foo(directory, folder) {
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

router.post("/add/files", upload.array("file"), (req, res) => {
  const toJson = JSON.parse(req.body.order);
  const directoryPath = `./uploads/${req.body.order_id}`;

  foo(directoryPath, req.body.order_id)
    // fs.readdir(directoryPath, function (err, files) {
    //     if (err) {
    //         return console.log('Unable to scan directory: ' + err);
    //     }
    //     files.forEach(function (file) {
    //         fileList.push(`/${req.body.order_id}/${file}`)
    //     });
    // });
    .then((files) => {
      console.log(files);

      const newOrder = new Order({
        ...toJson,
        placed: Date.now(),
        status: "Nowe",
        files: [...files],
      });
      newOrder
        .save()
        .then((data) => {
          res.json(data);
          console.log(`Wpis dodany do bazy`);
        })
        .catch((err) => {
          res.status(404);
        });
    });
  // const newOrder = new Order({
  //     ...toJson,
  //     placed: Date.now(),
  //     status: "Nowe",
  //     files: [...fileList]
  // })
  // newOrder.save()
  //     .then(data => {
  //         res.json(data);
  //         console.log(`Wpis dodany do bazy`);
  //     })
  //     .catch(err => {
  //         res.status(404);
  //     })
});

router.put("/update/:id", (req, res) => {
  var id = req.params.id;
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
