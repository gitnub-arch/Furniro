const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");

const sourceDir = path.join(__dirname, "..", "..", "js", "client");
const destinationDir = path.join(__dirname, "..", "..", "public", "js");

// Создаем папку назначения, если её нет
if (!fs.existsSync(destinationDir)) {
  fs.mkdirSync(destinationDir, { recursive: true });
}

function startBuilding() {
  // Функция для копирования файла
  const copyFile = (srcFile, destFile) => {
    fs.copyFile(srcFile, destFile, (err) => {
      if (err) {
        console.error(
          `Ошибка копирования файла ${srcFile} в ${destFile}:`,
          err
        );
      }
    });
  };

  // Наблюдатель за файлами
  const watcher = chokidar.watch(sourceDir, { persistent: true });

  watcher
    .on("add", (filePath) => {
      if (path.extname(filePath) === ".js") {
        const destFile = path.join(destinationDir, path.basename(filePath));
        copyFile(filePath, destFile);
      }
    })
    .on("change", (filePath) => {
      if (path.extname(filePath) === ".js") {
        const destFile = path.join(destinationDir, path.basename(filePath));
        copyFile(filePath, destFile);
      }
    })
    .on("unlink", (filePath) => {
      if (path.extname(filePath) === ".js") {
        const destFile = path.join(destinationDir, path.basename(filePath));
        fs.unlink(destFile, (err) => {
          if (err) {
            console.error(`Ошибка удаления файла ${destFile}:`, err);
          } else {
          }
        });
      }
    });

  console.log(`Наблюдение за изменениями в папке ${sourceDir}`);
}

module.exports = {
  startBuilding,
  srcDir: sourceDir,
};
