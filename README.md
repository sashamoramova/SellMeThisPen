# SellMeThisPen
Для работы STT и перевода с помощью Whisper необходимо установить на машинку локально:

Python (например, 3.13)
- для запуска Whisper и его зависимостей.

Whisper
- библиотека для распознавания и перевода речи от OpenAI.
Устанавливается через pip через командную строку:
pip install git+https://github.com/openai/whisper.git

ffmpeg
- утилита для обработки аудио, необходима для работы Whisper.
Скачивается с https://ffmpeg.org/download.html, путь к папке bin добавляется в PATH.
Можно установить вручную через командную строку:
pip install torch
