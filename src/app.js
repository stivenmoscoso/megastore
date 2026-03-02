const express = require('express');
const { connectMongo } = require('./config/db');
require('dotenv').config();

const app = express();
app.use(express.json());

// Importar Rutas
const migrationRoutes = require('./routes/migration.routes');
const productRoutes = require('./routes/product.routes');
const reportRoutes = require('./routes/report.routes');

// Vincular Rutas (Endpoints)
app.use('/api/migrate', migrationRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reports', reportRoutes);

// Iniciar Conexiones
connectMongo();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`);
});
