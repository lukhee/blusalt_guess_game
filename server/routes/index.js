const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.send('server running on home'));

module.exports = router;
