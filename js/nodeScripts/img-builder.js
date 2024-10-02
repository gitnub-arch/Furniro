const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");

const sourceDir = path.join(__dirname, "..", "..", "img");
const destinationDir = path.join(__dirname, "..", "..", "public", "img");

const validExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".svg",
  ".webp",
];

// Создаем папку назначения, если её нет
if (!fs.existsSync(destinationDir)) {
  fs.mkdirSync(destinationDir, { recursive: true });
}

function buildImgFiles() {
  // Функция для копирования файла
  const copyFile = (srcFile, destFile) => {
    try {
      fs.copyFile(srcFile, destFile, (err) => {
        if (err) {
          console.error(
            `Ошибка копирования файла ${srcFile} в ${destFile}:`,
            err
          );
        }
      });
    } catch (err) {
      console.error(
        `Необработанная ошибка при копировании файла ${srcFile} в ${destFile}:`,
        err
      );
    }
  };

  // Функция для удаления файла
  const deleteFile = (destFile) => {
    try {
      fs.unlink(destFile, (err) => {
        if (err) {
          console.error(`Ошибка удаления файла ${destFile}:`, err);
        } else {
          console.log(`Файл ${destFile} успешно удален`);
        }
      });
    } catch (err) {
      console.error(
        `Необработанная ошибка при удалении файла ${destFile}:`,
        err
      );
    }
  };

  // Наблюдатель за файлами
  const watcher = chokidar.watch(sourceDir, { persistent: true });

  watcher
    .on("add", (filePath) => {
      const ext = path.extname(filePath).toLowerCase();
      if (validExtensions.includes(ext)) {
        const destFile = path.join(destinationDir, path.basename(filePath));
        copyFile(filePath, destFile);
      }
    })
    .on("change", (filePath) => {
      const ext = path.extname(filePath).toLowerCase();
      if (validExtensions.includes(ext)) {
        const destFile = path.join(destinationDir, path.basename(filePath));
        copyFile(filePath, destFile);
      }
    })
    .on("unlink", (filePath) => {
      const ext = path.extname(filePath).toLowerCase();
      if (validExtensions.includes(ext)) {
        const destFile = path.join(destinationDir, path.basename(filePath));
        deleteFile(destFile);
      }
    })
    .on("error", (error) => {
      console.error(`Ошибка наблюдателя:`, error);
    });
}


module.exports = {
    buildImgFiles,
    srcDir: sourceDir
}