const express = require("express");
const router = express.Router();
const fs = require("fs").promises;

async function getFolders(req, res) {
  // const folder = req.params.path;
  const folder = req.body.currentPath;
  table = [];
  const items = await fs.readdir(`./${folder}`, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      // await getFolders(`${folder}/${item.name}`);
      table.push({
        name: item.name,
        type: "directory",
        path: folder,
        parent: req.body.parentPath,
      });
    } else {
      table.push({
        name: item.name,
        type: "file",
        path: folder,
        parent: req.body.parentPath,
      });
    }
  }
  res.send(table);
  // return table;
}

router.post("/show/", function (req, res) {
  // console.log(req.body);
  getFolders(req, res);
  // getFolders("./public", req, res);
  // res.send(getFolders("./public"));

  // res.sendStatus(200);
});

module.exports = router;
