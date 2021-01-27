const express = require("express");
const router = express.Router();
const fileSys = require("fs");
const fs = require("fs").promises;
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // const dir = req.body.params.path;
    const jsData = JSON.parse(req.body.order);
    const dir = jsData.destination;
    if (fileSys.existsSync(dir)) {
      return cb(null, dir);
    } else {
      return fs.mkdir(dir, (err) => cb(err, dir));
    }
  },
  // destination: function (req, file, cb) {
  //   cb(null, "./public/aaa/");
  // },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

async function getFolders(req, res) {
  // const folder = req.params.path;
  const folder = req.body.currentPath;
  let elements = {
    folders: [],
    files: [],
  };
  const items = await fs.readdir(`./${folder}`, { withFileTypes: true });

  for (const item of items) {
    const element = {
      name: item.name,
      type: item.isDirectory() ? "directory" : "file",
      path: folder,
    };
    item.isDirectory()
      ? elements.folders.push(element)
      : elements.files.push(element);
  }
  res.send(elements);
}

async function createFolder(req, res) {
  const parentDir = req.body.currentPath;
  const newPath = path.join(parentDir, req.body.newDirectory);

  try {
    await fs.mkdir(newPath);
  } catch {
    console.log(`dir already exists`);
  } finally {
    res.send({ parent: parentDir, new: newPath });
  }
}

router.post("/show/", function (req, res) {
  getFolders(req, res);
});

router.post("/mkdir/", function (req, res) {
  createFolder(req, res);
});

router.post("/upload/", upload.array("file"), function (req, res) {
  res.send({ data: "success" });
});

module.exports = router;
