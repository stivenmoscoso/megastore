const fs = require('fs');
const csv = require('csv-parser');
const { pool } = require('../config/db');

const migrate = async (filePath) => {
const client = await pool.connect();
try {
await client.query('BEGIN');
const results = [];
const stream = fs.createReadStream(filePath).pipe(csv());

for await (const row of stream) {
// 1. Categoria
await client.query('INSERT INTO categories (name) VALUES ($1) ON CONFLICT DO NOTHING', [row.product_category]);
const resCat = await client.query('SELECT id FROM categories WHERE name = $1', [row.product_category]);

// 2. Proveedor
await client.query('INSERT INTO suppliers (supplier_name, supplier_email) VALUES ($1, $2) ON CONFLICT DO NOTHING', [row.supplier_name, row.supplier_email]);
const resSupp = await client.query('SELECT id FROM suppliers WHERE supplier_name = $1', [row.supplier_name]);

// 3. Cliente
await client.query('INSERT INTO customers (customer_name, customer_email, customer_address, customer_phone) VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING',
[row.customer_name, row.customer_email, row.customer_address, row.customer_phone]);
const resCust = await client.query('SELECT id FROM customers WHERE customer_email = $1', [row.customer_email]);

// 4. Producto
await client.query('INSERT INTO products (sku, name, unit_price, category_id, supplier_id) VALUES ($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING',
[row.product_sku, row.product_name, row.unit_price, resCat.rows[0].id, resSupp.rows[0].id]);
const resProd = await client.query('SELECT id FROM products WHERE sku = $1', [row.product_sku]);

// 5. Orden
await client.query('INSERT INTO orders (transaction_id, id_customer, created_at) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
[row.transaction_id, resCust.rows[0].id, row.date]);
const resOrder = await client.query('SELECT id FROM orders WHERE transaction_id = $1', [row.transaction_id]);

// 6. Detalle
await client.query('INSERT INTO order_details (id_order, id_product, quantity, subtotal) VALUES ($1,$2,$3,$4)',
[resOrder.rows[0].id, resProd.rows[0].id, row.quantity, row.total_line_value]);
}
await client.query('COMMIT');
return { success: true };
} catch (e) {
await client.query('ROLLBACK');
throw e;
} finally { client.release(); }
};

module.exports = { migrate };
