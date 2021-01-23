const express = require("express");
const router = express.Router();
const fs = require("fs").promises;

async function getFolders(req, res) {
  // const folder = req.params.path;
  const folder = req.body.currentPath;
  let elements = {
    folders: [],
    files: []
  };
  const items = await fs.readdir(`./${folder}`, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      elements.folders.push({
        name: item.name,
        type: "directory",
        path: folder,
        // parent: req.body.parentPath,
      });
    } else {
      elements.files.push({
        name: item.name,
        type: "file",
        path: folder,
        // parent: req.body.parentPath,
      });
    }
  }
  res.send(elements);
}

router.post("/show/", function (req, res) {
  getFolders(req, res);
});

module.exports = router;
