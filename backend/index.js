const express = require('express');
const sql = require('mssql');

const app = express();
app.use(express.json());

// Configuración de SQL Server
const config = {
  user: 'sa',
  password: '31010611',
  server: 'DESKTOP-U1KPSCC\\SQLEXPRESS',
  database: 'TorneosGamers',
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

// Listar usuarios
app.get('/usuarios', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query(`
      SELECT id_usuario, nombre, email, telefono, fecha_registro
      FROM Usuarios
      ORDER BY fecha_registro DESC
    `);
    res.json(result.recordset); // ✅ devuelve JSON limpio y ordenado
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Registrar usuario con validación robusta
app.post('/usuarios', async (req, res) => {
  const { nombre, email, telefono } = req.body;

  // Campos obligatorios
  if (!nombre || !email || !telefono) {
    return res.status(400).json({ error: "Todos los campos (nombre, email, telefono) son obligatorios" });
  }

  // Validación de formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Formato de email inválido" });
  }

  // Validación de longitud de teléfono (flexible, 7–15 dígitos)
  const phoneDigits = telefono.replace(/\D/g, "");
  if (phoneDigits.length < 7 || phoneDigits.length > 15) {
    return res.status(400).json({ error: "Teléfono debe tener entre 7 y 15 dígitos" });
  }

  try {
    await sql.connect(config);

    // Evitar email duplicado
    const existing = await sql.query`SELECT 1 AS found FROM Usuarios WHERE email = ${email}`;
    if (existing.recordset.length > 0) {
      return res.status(409).json({ error: "El email ya está registrado" });
    }

    await sql.query`
      INSERT INTO Usuarios (nombre, email, telefono)
      VALUES (${nombre}, ${email}, ${telefono})
    `;
    res.status(201).json({ mensaje: "Usuario registrado correctamente ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ mensaje: "API de TorneosGamers funcionando ✅" });
});

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});