const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const path = require('path');
const productsRoutes = require('./src/routes/productsRoutes');

const PORT = process.env.PORT || 3005;

// Habilitar CORS para todas las rutas.
app.use(cors());

// Middlewares el npm de express que realizamos.
app.use(express.json());

// Rutas, aquí se pueden agregar las demas rutas que iremos creando.
app.use('/api/products', productsRoutes);

// Servidor.
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);    
});