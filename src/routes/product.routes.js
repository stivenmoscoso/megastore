const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const AuditLog = require('../models/AuditLog');

router.delete('/:sku', async (req, res) => {
const { sku } = req.params;
try {
const prod = await pool.query('SELECT * FROM products WHERE sku = $1', [sku]);

if (prod.rows.length === 0) return res.status(404).json({ message: "Product not found" });

await pool.query('DELETE FROM products WHERE sku = $1', [sku]);

// Guardar en MongoDB (Auditoría)
await AuditLog.create({
action: 'DELETE',
entity: 'Product',
oldData: prod.rows[0]
});

res.json({ message: "Product deleted and logged in NoSQL" });
} catch (err) {
res.status(500).json({ error: err.message });
}
});

module.exports = router;