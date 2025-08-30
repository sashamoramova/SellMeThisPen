const path = require('path');
const fs = require('fs'); // добавьте эту строку!
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { spawn } = require('child_process'); // меняем execFile на spawn

exports.transcribeAndTranslate = async (audioPath) => {
  // 1. Распознаём аудио через whisper (локально)
  const command = 'C:/Users/Пользователь/AppData/Local/Programs/Python/Python313/python.exe'; // полный путь к python
  const args = [
    '-m', 'whisper', // запускаем whisper как python модуль
    audioPath,
    '--model', 'base',
    '--language', 'en',
    '--output_format', 'txt',
    '--output_dir', path.dirname(audioPath)
  ];

  await new Promise((resolve, reject) => {
    const process = spawn(command, args);

    process.stderr.on('data', (data) => {
      console.error(`Whisper stderr: ${data}`);
    });

    process.on('close', (code) => {
      if (code !== 0) {
        reject(new Error('Whisper завершился с ошибкой ' + code));
      } else {
        resolve();
      }
    });

    process.on('error', (error) => {
      reject(error);
    });
  });

  // 2. Читаем результат из .txt файла
  const txtPath = path.join(path.dirname(audioPath), path.basename(audioPath, path.extname(audioPath)) + '.txt');
  let text = '';
  if (fs.existsSync(txtPath)) {
    text = fs.readFileSync(txtPath, 'utf-8').trim();
  } else {
    throw new Error('Файл результата не найден: ' + txtPath);
  }

  // 3. Возвращаем только транскрипцию
  return { text, translated: text };
};