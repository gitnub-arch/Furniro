const fs = require("fs");
const path = require("path");
const pug = require("pug");
const chokidar = require("chokidar");

// Цвета терминала
const red = "\x1b[31m";
const green = "\x1b[32m";

const srcDir = path.join(__dirname, "..", "..", "views", "pages");
const destDir = path.join(__dirname, "..", "..", "public");

function pugCompiler() {
  function compilePugFile(filePath) {
    try {
      const relativePath = path.relative(srcDir, filePath);
      const destPath = path.join(destDir, relativePath.replace(/\.pug$/, ".html"));
      const destDirPath = path.dirname(destPath);

      if (!fs.existsSync(destDirPath)) {
        fs.mkdirSync(destDirPath, { recursive: true });
      }

      const html = pug.renderFile(filePath);
      
      fs.writeFileSync(destPath, html);

    } catch (err) {
      const fileName = path.basename(filePath);
      console.error(red + `Ошибка компиляции файла ${fileName}:`, err.message);
    }
  }

  function compileAllPugFilesInDir(dir) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isFile() && file.endsWith(".pug")) {
        compilePugFile(fullPath);
      } else if (stat.isDirectory()) {
        compileAllPugFilesInDir(fullPath);
      }
    });
  }

  compileAllPugFilesInDir(srcDir);

  const pugWatcher = chokidar.watch(path.join(__dirname, "..", "..", "views"), {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
  });

  pugWatcher
    .on("add", (filePath) => {
      if (filePath.startsWith(srcDir)) {
        compilePugFile(filePath);
      } else {
        compileAllPugFilesInDir(srcDir);
      }
    })
    .on("change", (filePath) => {
      if (filePath.startsWith(srcDir)) {
        compilePugFile(filePath);
      } else {
        compileAllPugFilesInDir(srcDir);
      }
    })
    .on("unlink", (filePath) => {
      if (filePath.startsWith(srcDir)) {
        const relativePath = path.relative(srcDir, filePath);
        const destPath = path.join(destDir, relativePath.replace(/\.pug$/, ".html"));
        if (fs.existsSync(destPath)) {
          fs.unlinkSync(destPath);
          console.log(`Удален ${destPath}`);
        }
      } else {
        compileAllPugFilesInDir(srcDir);
      }
    });
}

module.exports = {
  startCompile: pugCompiler,
  srcDir
};

console.log("Ожидание изменений Pug файлов...");
