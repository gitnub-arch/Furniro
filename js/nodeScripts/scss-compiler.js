const sass = require("sass");
const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");

// Цвета терминала
const red = "\x1b[31m";
const green = "\x1b[32m";

const inputFilePath = path.join(__dirname, "..", "..", "scss/style.scss");
const outputFilePath = path.join(__dirname, "..", "..", "public/css/style.css");

function startCompilseSass() {
  function compileSass() {
    sass.render(
      {
        file: inputFilePath,
        outFile: outputFilePath,
        sourceMap: true,
      },
      (err, result) => {
        if (err) {
          console.error(err);
        } else {
          fs.writeFile(outputFilePath, result.css, (err) => {
            if (err) {
              console.error(err);
            }
          });

          if (result.map) {
            fs.writeFile(`${outputFilePath}.map`, result.map, (err) => {
              if (err) {
                console.error(err);
              }
            });
          }
        }
      }
    );
  }

  // Watch for changes in SCSS files
  const watcher = chokidar.watch(path.join(__dirname, "../../scss/**/*.scss"), {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
  });

  watcher
    .on("add", (filePath) => {})
    .on("change", (filePath) => {
      compileSass();
    })
    .on("unlink", (filePath) =>
      console.log(`File ${filePath} has been removed.`)
    )
    .on("error", (error) => console.error(`Watcher error: ${error}`));

  // Initial compilation
  compileSass();
}

module.exports = {
  startCompile: startCompilseSass,
  srcDir: inputFilePath,
};
