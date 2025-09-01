const path = require('path');
const fs = require('fs'); // добавьте эту строку!
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { spawn } = require('child_process'); // меняем execFile на spawn

exports.transcribeAndTranslate = async (audioPath) => {
  // 1. Распознаём аудио через whisper (локально, автоопределение языка)
  const command = 'C:/Users/Пользователь/AppData/Local/Programs/Python/Python313/python.exe';
  const args = [
    '-m', 'whisper',
    audioPath,
    '--model', 'base',
    '--output_format', 'txt',
    '--output_dir', path.dirname(audioPath)
    // язык не указываем, чтобы whisper сам определил
  ];

  await new Promise((resolve, reject) => {
    const process = spawn(command, args);
    let whisperStdout = '';
    let whisperStderr = '';

    process.stdout.on('data', (data) => {
      whisperStdout += data.toString();
    });
    process.stderr.on('data', (data) => {
      whisperStderr += data.toString();
      console.error(`Whisper stderr: ${data}`);
    });

    process.on('close', (code) => {
      if (code !== 0) {
        console.error('Whisper завершился с ошибкой', code);
        console.error('Whisper stdout:', whisperStdout);
        console.error('Whisper stderr:', whisperStderr);
        reject(new Error('Whisper завершился с ошибкой ' + code + '\nstdout: ' + whisperStdout + '\nstderr: ' + whisperStderr));
      } else {
        console.log('Whisper успешно завершился. stdout:', whisperStdout);
        resolve();
      }
    });

    process.on('error', (error) => {
      console.error('Ошибка запуска whisper:', error);
      reject(error);
    });
  });

  // 2. Читаем результат из .txt файла
  const baseName = path.basename(audioPath, path.extname(audioPath));
  const dirName = path.dirname(audioPath);
  const txtPath = path.join(dirName, baseName + '.txt');
  const jsonPath = path.join(dirName, baseName + '.json');
  let text = '';
  let detectedLang = 'auto';
  if (fs.existsSync(txtPath)) {
    try {
      text = fs.readFileSync(txtPath, 'utf-8').trim();
      console.log('Whisper транскрипция:', text);
    } catch (err) {
      console.error('Ошибка чтения файла результата:', txtPath, err);
      throw new Error('Ошибка чтения файла результата: ' + txtPath + '\n' + err.message);
    }
  } else {
    console.error('Файл результата не найден:', txtPath);
    throw new Error('Файл результата не найден: ' + txtPath);
  }

  // 2.1. Читаем определённый Whisper язык из .json (если есть)
  if (fs.existsSync(jsonPath)) {
    try {
      const info = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      if (info && info.language) {
        detectedLang = info.language;
        console.log('Whisper определил язык:', detectedLang);
      }
    } catch (err) {
      console.error('Ошибка чтения файла языка Whisper:', jsonPath, err);
    }
  }

  // 3. Переводим текст на испанский через LibreTranslate
  let translated = text;
  try {
    console.log('Отправляем на перевод:', { text, detectedLang });
    const res = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: detectedLang || 'auto',
        target: 'es',
        format: 'text'
      })
    });
    if (res.ok) {
      const data = await res.json();
      translated = data.translatedText || text;
    } else {
      console.error('Ошибка перевода:', res.status, await res.text());
    }
  } catch (e) {
    console.error('Ошибка при обращении к сервису перевода:', e);
  }

  // 4. Возвращаем оригинал и перевод
  return { text, translated };
};