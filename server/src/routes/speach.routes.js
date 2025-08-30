const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const speachController = require('../controllers/speach.controller');

const upload = multer({ dest: path.join(__dirname, '../../tmp') });

router.post('/translate', upload.single('audio'), speachController.translateAudio);

module.exports = router;
