const express = require('express');
const app = express();
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde /public
app.use(express.static(path.join(__dirname, 'public')));

// Ruta raíz para mostrar mensaje en la home
app.get('/', (req, res) => {
  res.send('<h2>🚀 Plataforma de Gestión Agrícola en Railway</h2><p>Servidor activo y escuchando solicitudes.</p>');
});

// Configurar conexión a PostgreSQL en Railway
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
});

// Ruta de prueba para la API
app.get('/api', (req, res) => {
  res.send('API conectada correctamente ✅');
});

// Obtener todos los registros de la tabla1
app.get('/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tabla1');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al consultar items:', err);
    res.status(500).json({ error: 'Error al obtener los items' });
  }
});

// Insertar un nuevo registro en tabla1
app.post('/items', async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tabla1 (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al insertar item:', err);
    res.status(500).json({ error: 'Error al insertar item' });
  }
});

// Eliminar un registro por ID en tabla1
app.delete('/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM tabla1 WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error('Error al eliminar item:', err);
    res.status(500).json({ error: 'Error al eliminar item' });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
