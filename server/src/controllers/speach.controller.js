const path = require('path');
const fs = require('fs');
const { transcribeAndTranslate } = require('../services/speach.service');

exports.translateAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }
    // путь к временному файлу
    const audioPath = req.file.path;
    const { text, translated } = await transcribeAndTranslate(audioPath);
    // удаляем временный файл
    fs.unlink(audioPath, () => {});
    res.json({ text, translated });
  } catch (e) {
    console.error('SPEACH TRANSLATE ERROR:', e);
    res.status(500).json({ error: 'Server error', details: e.message });
  }
};
