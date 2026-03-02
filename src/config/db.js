const { Pool } = require('pg');
const mongoose = require('mongoose');
require('dotenv').config();

// Configuración SQL (Postgres)
const pool = new Pool({
user: process.env.PG_USER,
host: process.env.PG_HOST,
database: process.env.PG_DB,
password: process.env.PG_PASSWORD,
port: process.env.PG_PORT,
});

// Probar conexión SQL inmediatamente
pool.query('SELECT NOW()', (err, res) => {
if (err) console.error("Error en PostgreSQL:", err.message);
else console.log("PostgreSQL Conectado");
});

const connectMongo = async () => {
try {
await mongoose.connect(process.env.MONGO_URI);
console.log('MongoDB Conectado');
} catch (err) {
console.error("Error en MongoDB:", err.message);
}
};

module.exports = { pool, connectMongo };
  

 
  