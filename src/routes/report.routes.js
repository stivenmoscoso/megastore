const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// Reporte de proveedores
router.get('/suppliers', async (req, res) => {
try {
const result = await pool.query(`
SELECT s.supplier_name, SUM(od.subtotal) as revenue
FROM suppliers s
JOIN products p ON s.id = p.supplier_id
JOIN order_details od ON p.id = od.id_product
GROUP BY s.supplier_name
`);
res.json(result.rows);
} catch (err) {
res.status(500).json({ error: err.message });
}
});

module.exports = router;

// Producto Estrella (Ranking por ventas)
router.get('/star-products', async (req, res) => {
try {
const query = `
SELECT
p.sku,
p.name as product_name,
c.name as category,
SUM(od.quantity) as total_units_sold,
SUM(od.subtotal) as total_income
FROM products p
JOIN categories c ON p.category_id = c.id
JOIN order_details od ON p.id = od.id_product
GROUP BY p.id, p.sku, p.name, c.name
ORDER BY total_units_sold DESC
LIMIT 5; -- Trae el Top 5
`;
const result = await pool.query(query);
res.json(result.rows);
} catch (err) {
res.status(500).json({ error: err.message });
}
});

// por categoria (Valor potencial de inventario)
router.get('/inventory-value', async (req, res) => {
const query = `
SELECT c.name as category, SUM(p.unit_price) as potential_value
FROM products p
JOIN categories c ON p.category_id = c.id
GROUP BY c.name;
`;
const result = await pool.query(query);
res.json(result.rows);
});