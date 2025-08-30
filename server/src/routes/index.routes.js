
const express = require('express');
const router = express.Router();

router.use('/speach', require('./speach.routes'));

module.exports = router;
