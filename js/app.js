const express = require('express');
const path = require('path');

const app = express();

// Укажите путь к статическим файлам
app.use(express.static(path.join(__dirname, '..', 'public')));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
