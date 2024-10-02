const fs = require('fs');
const path = require('path');
const pug = require('pug');
const chokidar = require('chokidar');
const sass = require('node-sass');

// Цвета терминала
const red = "\x1b[31m";
const green = "\x1b[32m";

const srcDir = path.join(__dirname, '..', 'views', 'pages');
const destDir = path.join(__dirname, '..', 'public');
const scssSrcDir = path.join(__dirname, '..', 'scss');
const cssDestDir = path.join(destDir, 'css');

function compilePugFile(filePath) {
  const relativePath = path.relative(srcDir, filePath);
  const destPath = path.join(destDir, relativePath.replace(/\.pug$/, '.html'));
  const destDirPath = path.dirname(destPath);

  if (!fs.existsSync(destDirPath)) {
    fs.mkdirSync(destDirPath, { recursive: true });
  }

  const html = pug.renderFile(filePath);
  fs.writeFileSync(destPath, html);
  const fileName = path.basename(filePath)
  
  console.log(green + `Компиляция файла ${fileName} в ${path.basename(destPath)} прошла успешно`);
}

function compileAllPugFilesInDir(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isFile() && file.endsWith('.pug')) {
      compilePugFile(fullPath);
    } else if (stat.isDirectory()) {
      compileAllPugFilesInDir(fullPath);
    }
  });
}

function compileScss(filePath) {
  const fileName = path.basename(filePath);
  if (fileName.startsWith('_')) {
    return; // Skip partials
  }

  const destPath = path.join(cssDestDir, fileName.replace(/\.scss$/, '.css'));
  const destDirPath = path.dirname(destPath);

  if (!fs.existsSync(destDirPath)) {
    fs.mkdirSync(destDirPath, { recursive: true });
  }

  sass.render({
    file: filePath,
    outFile: destPath
  }, (error, result) => {
    if (error) {
      console.error(red + `Ошибка компиляции в SCSS: ${error.message}`);
    } else {
      fs.writeFileSync(destPath, result.css);
      console.log(`Файл ${path.basename(filePath)} скомпилирован в ${path.basename(destPath)}`);
    }
  });
}

function compileAllScssFilesInDir(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isFile() && file.endsWith('.scss')) {
      compileScss(fullPath);
    } else if (stat.isDirectory()) {
      compileAllScssFilesInDir(fullPath);
    }
  });
}

compileAllPugFilesInDir(srcDir);
compileAllScssFilesInDir(scssSrcDir);

const pugWatcher = chokidar.watch(path.join(__dirname, '..', 'views'), {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true
});

const scssWatcher = chokidar.watch(path.join(__dirname, '..', 'scss'), {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true
});

pugWatcher
  .on('add', filePath => {
    if (filePath.startsWith(srcDir)) {
      compilePugFile(filePath);
    } else {
      compileAllPugFilesInDir(srcDir);
    }
  })
  .on('change', filePath => {
    if (filePath.startsWith(srcDir)) {
      compilePugFile(filePath);
    } else {
      compileAllPugFilesInDir(srcDir);
    }
  })
  .on('unlink', filePath => {
    if (filePath.startsWith(srcDir)) {
      const relativePath = path.relative(srcDir, filePath);
      const destPath = path.join(destDir, relativePath.replace(/\.pug$/, '.html'));
      if (fs.existsSync(destPath)) {
        fs.unlinkSync(destPath);
        console.log(`Удален ${destPath}`);
      }
    } else {
      compileAllPugFilesInDir(srcDir);
    }
  });

scssWatcher
  .on('add', compileScss)
  .on('change', compileScss)
  .on('unlink', compileScss);

console.log('Ожидание изменений файлов...');
