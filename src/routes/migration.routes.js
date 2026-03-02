const express = require('express');
const router = express.Router();
const { migrate } = require('../services/migration');

router.post('/', async (req, res) => {
try {
await migrate('./data.csv');
res.status(201).json({ message: "Migration completed successfully" });
} catch (err) {
res.status(500).json({ error: err.message });
}
});

module.exports = router;