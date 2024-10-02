const pug = require("./nodeScripts/pug-compiler.js");
const scss = require("./nodeScripts/scss-compiler.js");
const js = require("./nodeScripts/js-builder.js");
const img = require("./nodeScripts/img-builder.js");
const chokidar = require("chokidar");
const path = require('path')
const express = require("express");

const app = express();

pug.startCompile();
scss.startCompile();
js.startBuilding();
img.buildImgFiles();

const publicSrc = path.join(__dirname, "..", "public");

// const watcher = chokidar.watch(
//   [pug.srcDir, js.srcDir, publicSrc, scss.srcDir],
//   {
//     persistent: true,
//   }
// );

// watcher.on("change", (path) => {
//   console.log(`File ${path} has been changed`);

//   console.log(path)

//   if (path.endsWith(".pug")) {
//     pug.startCompile();
//   } else if (path.endsWith(".scss")) {
//     scss.startCompile();
//   } else if (path.endsWith(".js")) {
//     js.startBuilding();
//   } else if (
//     path.endsWith(".png") ||
//     path.endsWith(".jpg") ||
//     path.endsWith(".jpeg") ||
//     path.endsWith(".svg")
//   ) {
//     img.buildImgFiles();
//   }
// });

// Укажите путь к статическим файлам
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, ".." ,"public", "index.html"));
});

const PORT = 2020;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
