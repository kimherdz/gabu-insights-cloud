const express = require('express');
const cors = require('cors');
const pool = require('./db'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = 'marta1329';


// Middleware para manejar JSON
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Middleware para autenticar el token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token faltante' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    req.user = user; // Guardar los datos del usuario en la solicitud
    next();
  });
};

// Ruta para obtener todos los niños
app.get('/children', async (req, res) => {
  try {
    const query = 'SELECT id, nombre FROM children';
    const { rows } = await pool.query(query);
    res.json(rows); // Asegúrate de enviar la respuesta en formato JSON
  } catch (error) {
    console.error('Error al obtener la lista de niños:', error);
    res.status(500).json({ message: 'Error al obtener la lista de niños' });
  }
});

// Ruta para obtener todos los entrenadores
app.get('/coaches', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM coaches');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al obtener entrenadores:', err);
    res.status(500).json({ error: 'Error al obtener entrenadores' });
  }
});

// Ruta para registrar asistencia
app.post('/attendances', authenticateToken, async (req, res) => {
  const coachId = req.user.id; // Extrae el ID del coach desde el token
  const { nino_id, act_eleccion_juego, act_perder, negociar, convivencia, comentarios, fecha, horas_juego } = req.body;

  try {
    const query = `
      INSERT INTO attendances (nino_id, act_eleccion_juego, act_perder, negociar, convivencia, comentarios, fecha, horas_juego, coach_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    const values = [nino_id, act_eleccion_juego, act_perder, negociar, convivencia, comentarios, fecha, horas_juego, coachId];

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al registrar la asistencia:', err);
    res.status(500).json({ error: 'Error al registrar la asistencia' });
  }
});

// Ruta para obtener los comentarios de las asistencias de los hijos del padre logueado
app.get('/attendances/comments', authenticateToken, async (req, res) => {
  const parentId = req.user.id;
  try {
    const query = `
      SELECT c.nombre AS coach_name, a.comentarios 
      FROM attendances a 
      JOIN coaches c ON a.coach_id = c.id
      JOIN children ch ON a.nino_id = ch.id
      WHERE a.comentarios IS NOT NULL AND ch.padre_id = $1;
    `;
    const { rows } = await pool.query(query, [parentId]);
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener los comentarios:', err);
    res.status(500).json({ error: 'Error al obtener los comentarios' });
  }
});

// Ruta para obtener las habilidades adquiridas del hijo del padre logueado
app.get('/attendances/skills', authenticateToken, async (req, res) => {
  const parentId = req.user.id;
  try {
    const query = `
      SELECT SUM(act_perder) AS act_perder, 
             SUM(negociar) AS negociar, 
             SUM(act_eleccion_juego) AS act_eleccion_juego 
      FROM attendances a
      JOIN children ch ON a.nino_id = ch.id
      WHERE ch.padre_id = $1;
    `;
    const { rows } = await pool.query(query, [parentId]);
    res.json(rows[0]);
  } catch (err) {
    console.error('Error al obtener los datos de habilidades:', err);
    res.status(500).json({ error: 'Error al obtener los datos de habilidades' });
  }
});

// Ruta para obtener las horas de juego por día de la semana
app.get('/game/hours', authenticateToken, async (req, res) => {
  const parentId = req.user.id;

  try {
    const query = `
      SELECT fecha, horas_juego 
      FROM attendances a
      JOIN children ch ON a.nino_id = ch.id
      WHERE ch.padre_id = $1 AND fecha >= NOW() - INTERVAL '7 days'
      ORDER BY fecha;
    `;
    const { rows } = await pool.query(query, [parentId]);
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener las horas de juego:', err);
    res.status(500).json({ error: 'Error al obtener las horas de juego' });
  }
});

// Ruta para obtener el nivel de convivencia por día de la semana
app.get('/game/coexistence', authenticateToken, async (req, res) => {
  const parentId = req.user.id;

  try {
    const query = `
      SELECT fecha, convivencia 
      FROM attendances a
      JOIN children ch ON a.nino_id = ch.id
      WHERE ch.padre_id = $1 AND fecha >= NOW() - INTERVAL '7 days'
      ORDER BY fecha;
    `;
    const { rows } = await pool.query(query, [parentId]);
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener el nivel de convivencia:', err);
    res.status(500).json({ error: 'Error al obtener el nivel de convivencia' });
  }
});

// Ruta para login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Verificar si el usuario es un padre
    const parentQuery = 'SELECT * FROM parents WHERE email = $1';
    const parentResult = await pool.query(parentQuery, [username]);

    if (parentResult.rows.length > 0) {
      const parent = parentResult.rows[0];

      // Verificar si el usuario está activo
      if (!parent.status) {
        return res.status(401).json({ message: 'Usuario no activo' });
      }

      const passwordMatch = await bcrypt.compare(password, parent.contrasena); // Verificar la contraseña

      if (passwordMatch) {
        const token = jwt.sign({ id: parent.id, role: 'parent', avatar: parent.avatar }, SECRET_KEY, { expiresIn: '1h' });
        return res.status(200).json({ token, role: 'parent' });
      } else {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }
    }

    // Verificar si el usuario es un coach
    const coachQuery = 'SELECT * FROM coaches WHERE email = $1';
    const coachResult = await pool.query(coachQuery, [username]);

    if (coachResult.rows.length > 0) {
      const coach = coachResult.rows[0];

      // Verificar si el usuario está activo
      if (!coach.status) {
        return res.status(401).json({ message: 'Usuario no activo' });
      }

      const passwordMatch = await bcrypt.compare(password, coach.contrasena); // Verificar la contraseña

      if (passwordMatch) {
        const token = jwt.sign({ id: coach.id, role: 'coach', avatar: coach.avatar }, SECRET_KEY, { expiresIn: '1h' });
        return res.status(200).json({ token, role: 'coach' });
      } else {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }
    }

    // Verificar si el usuario es un admin
    const adminQuery = 'SELECT * FROM admins WHERE email = $1';
    const adminResult = await pool.query(adminQuery, [username]);

    if (adminResult.rows.length > 0) {
      const admin = adminResult.rows[0];

      // Verificar la contraseña
      const passwordMatch = await bcrypt.compare(password, admin.contrasena);
      if (passwordMatch) {
        const token = jwt.sign({ id: admin.id, role: 'admin', avatar: admin.avatar }, SECRET_KEY, { expiresIn: '1h' });
        return res.status(200).json({ token, role: 'admin' });
      } else {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }
    }

    // Si no se encuentra el usuario en ninguna tabla
    res.status(404).json({ message: 'Usuario no encontrado' });
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Ruta para obtener los registros de asistencia del coach logueado
app.get('/coach/attendances', authenticateToken, async (req, res) => {
  const coachId = req.user.id;

  try {
    const query = `
      SELECT a.id, ch.nombre AS nombre_nino, a.act_eleccion_juego, a.act_perder, a.negociar, 
             a.convivencia, a.comentarios, a.fecha, a.horas_juego
      FROM attendances a
      JOIN children ch ON a.nino_id = ch.id
      WHERE a.coach_id = $1
      ORDER BY a.fecha DESC;
    `;
    const { rows } = await pool.query(query, [coachId]);
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener los registros de asistencia:', err);
    res.status(500).json({ error: 'Error al obtener los registros de asistencia' });
  }
});

//Ruta para actualizar la asistencia del coach logueado
app.put('/coach/attendance/update', authenticateToken, async (req, res) => {
  const { id, data } = req.body;

  try {
    // Construimos la consulta dinámicamente solo con los campos presentes en 'data'
    const fields = Object.keys(data).map((key, index) => `${key} = $${index + 1}`);
    const values = Object.values(data);

    const query = `
      UPDATE attendances
      SET ${fields.join(', ')}
      WHERE id = $${fields.length + 1}
    `;
    
    // Agregamos el ID al final de los valores
    await pool.query(query, [...values, id]);

    res.json({ message: 'Registro actualizado exitosamente' });
  } catch (err) {
    console.error('Error al actualizar el registro:', err);
    res.status(500).json({ error: 'Error al actualizar el registro' });
  }
});

// Ruta para registrar nuevos papas
app.post('/registerParent', async (req, res) => {
  const { name, email, phone, password, childName, childAge, minecraft, roblox, stumble_guys } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const parentResult = await pool.query(
      'INSERT INTO parents (nombre, telefono, email, contrasena) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, phone, email, hashedPassword]
    );

    const parentId = parentResult.rows[0].id;
    await pool.query(
      'INSERT INTO children (nombre, edad, padre_id, minecraft, roblox, stumble_guys) VALUES ($1, $2, $3, $4, $5, $6)',
      [childName, childAge, parentId, minecraft, roblox, stumble_guys]
    );

    res.status(201).json({ message: 'Papá e hijo registrados correctamente' });
  } catch (error) {
    console.error('Error registrando padre e hijo:', error);
    res.status(500).json({ error: 'Error registrando padre e hijo' });
  }
});

// Ruta para registrar nuevos coaches
app.post('/registerCoach', async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const coachResult = await pool.query(
      'INSERT INTO coaches (nombre, telefono, email, contrasena) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, phone, email, hashedPassword]
    );

    const coachId = coachResult.rows[0].id;

    res.status(201).json({ message: 'Coach registrado correctamente', coachId });
  } catch (error) {
    console.error('Error registrando coach:', error);
    res.status(500).json({ error: 'Error registrando coach' });
  }
});

// Ruta para obtener todos los registros de padres
app.get('/admin/parents', authenticateToken, async (req, res) => {
  try {
    const query = `
      SELECT id, nombre, telefono, email, contrasena, status
      FROM parents
      ORDER BY id ASC;
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener la lista de padres:', err);
    res.status(500).json({ error: 'Error al obtener la lista de padres' });
  }
});

// Ruta para actualizar un registro específico en la tabla de padres
app.put('/admin/parent/update', authenticateToken, async (req, res) => {
  const { id, data } = req.body;

  try {
    // Construimos la consulta dinámicamente solo con los campos presentes en 'data'
    const fields = Object.keys(data).map((key, index) => `${key} = $${index + 1}`);
    const values = Object.values(data);

    const query = `
      UPDATE parents
      SET ${fields.join(', ')}
      WHERE id = $${fields.length + 1}
      RETURNING *;
    `;
    
    // Agregamos el ID al final de los valores
    const { rows } = await pool.query(query, [...values, id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Registro de padre no encontrado' });
    }

    res.json({ message: 'Registro actualizado exitosamente', parent: rows[0] });
  } catch (err) {
    console.error('Error al actualizar el registro de padre:', err);
    res.status(500).json({ error: 'Error al actualizar el registro de padre' });
  }
});

// Ruta para obtener todos los registros de coaches
app.get('/admin/coaches', authenticateToken, async (req, res) => {
  try {
    const query = `
      SELECT id, nombre, telefono, email, contrasena, status
      FROM coaches
      ORDER BY id ASC;
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener la lista de coaches:', err);
    res.status(500).json({ error: 'Error al obtener la lista de coaches' });
  }
});

// Ruta para actualizar un registro específico en la tabla de padres
app.put('/admin/coach/update', authenticateToken, async (req, res) => {
  const { id, data } = req.body;

  try {
    // Construimos la consulta dinámicamente solo con los campos presentes en 'data'
    const fields = Object.keys(data).map((key, index) => `${key} = $${index + 1}`);
    const values = Object.values(data);

    const query = `
      UPDATE coaches
      SET ${fields.join(', ')}
      WHERE id = $${fields.length + 1}
      RETURNING *;
    `;
    
    // Agregamos el ID al final de los valores
    const { rows } = await pool.query(query, [...values, id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Registro de coach no encontrado' });
    }

    res.json({ message: 'Registro actualizado exitosamente', coach: rows[0] });
  } catch (err) {
    console.error('Error al actualizar el registro de coach:', err);
    res.status(500).json({ error: 'Error al actualizar el registro de coach' });
  }
});

// Ruta para obtener todos los niños con el nombre del padre
app.get('/admin/children', authenticateToken, async (req, res) => {
  try {
    const query = `
      SELECT ch.id, ch.nombre AS nombre_nino, ch.edad, p.nombre AS nombre_padre, ch.minecraft, ch.roblox, ch.stumble_guys, ch.status             
      FROM children ch
      JOIN parents p ON ch.padre_id = p.id
      ORDER BY ch.nombre;
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener los registros de niños:', err);
    res.status(500).json({ error: 'Error al obtener los registros de niños' });
  }
});

// Ruta para actualizar un niño
app.put('/admin/child/update', authenticateToken, async (req, res) => {
  const { id, data } = req.body;

  try {
    // Definir los campos que sí están en la tabla `children`
    const validFields = ['nombre', 'edad', 'padre_id', 'minecraft', 'roblox', 'stumble_guys', 'status'];
    
    // Filtrar el objeto `data` para incluir solo los campos válidos
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([key]) => validFields.includes(key))
    );

    // Crear el SET para la actualización
    const fields = Object.keys(filteredData).map((key, index) => `${key} = $${index + 1}`);
    const values = Object.values(filteredData);

    // Verificar si hay datos válidos para actualizar
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron campos válidos para actualizar.' });
    }

    // Realizar la consulta de actualización
    const query = `
      UPDATE children
      SET ${fields.join(', ')}
      WHERE id = $${fields.length + 1}
    `;
    await pool.query(query, [...values, id]);

    res.json({ message: 'Registro de niño actualizado exitosamente' });
  } catch (err) {
    console.error('Error al actualizar el registro de niño:', err);
    res.status(500).json({ error: 'Error al actualizar el registro de niño' });
  }
});

// Ruta para obtener el perfil del usuario
app.get('/user/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let query;
    if (userRole === 'parent') {
      query = 'SELECT nombre, telefono, email, avatar FROM parents WHERE id = $1';
    } else if (userRole === 'coach') {
      query = 'SELECT nombre, telefono, email, avatar FROM coaches WHERE id = $1';
    } else if (userRole === 'admin') {
      query = 'SELECT nombre, telefono, email, avatar FROM admins WHERE id = $1';
    } else {
      return res.status(400).json({ error: 'Rol de usuario no válido' });
    }

    const { rows } = await pool.query(query, [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener perfil de usuario:', error);
    res.status(500).json({ error: 'Error al obtener perfil de usuario' });
  }
});

app.put('/user/update', authenticateToken, async (req, res) => {
  const { nombre, telefono, email, avatar, contrasena } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    let query;
    let values;

    // Si la contraseña es proporcionada, la encriptamos
    let hashedPassword = contrasena ? await bcrypt.hash(contrasena, 10) : null;

    if (userRole === 'parent') {
      if (hashedPassword) {
        // Incluye la contraseña si es proporcionada
        query = `
          UPDATE parents
          SET nombre = $1, telefono = $2, email = $3, avatar = $4, contrasena = $5
          WHERE id = $6
        `;
        values = [nombre, telefono, email, avatar, hashedPassword, userId];
      } else {
        // Si no hay contraseña, solo actualiza los otros campos
        query = `
          UPDATE parents
          SET nombre = $1, telefono = $2, email = $3, avatar = $4
          WHERE id = $5
        `;
        values = [nombre, telefono, email, avatar, userId];
      }
    } else if (userRole === 'coach') {
      if (hashedPassword) {
        query = `
          UPDATE coaches
          SET nombre = $1, telefono = $2, email = $3, avatar = $4, contrasena = $5
          WHERE id = $6
        `;
        values = [nombre, telefono, email, avatar, hashedPassword, userId];
      } else {
        query = `
          UPDATE coaches
          SET nombre = $1, telefono = $2, email = $3, avatar = $4
          WHERE id = $5
        `;
        values = [nombre, telefono, email, avatar, userId];
      }
    } else if (userRole === 'admin') {
      if (hashedPassword) {
        query = `
          UPDATE admins
          SET nombre = $1, telefono = $2, email = $3, avatar = $4, contrasena = $5
          WHERE id = $6
        `;
        values = [nombre, telefono, email, avatar, hashedPassword, userId];
      } else {
        query = `
          UPDATE admins
          SET nombre = $1, telefono = $2, email = $3, avatar = $4
          WHERE id = $5
        `;
        values = [nombre, telefono, email, avatar, userId];
      }
    } else {
      return res.status(400).json({ error: 'Rol de usuario no válido' });
    }

    // Ejecutamos la consulta SQL
    await pool.query(query, values);
    res.json({ message: 'Perfil actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar perfil de usuario:', error);
    res.status(500).json({ error: 'Error al actualizar perfil de usuario' });
  }
});




// Ruta para obtener los avatars
app.get('/avatars', async (req, res) => {
  try {
    const avatars = [
      'https://storage.cloud.google.com/avatares/1.png',
      'https://storage.cloud.google.com/avatares/2.png',
      'https://storage.cloud.google.com/avatares/3.png',
      'https://storage.cloud.google.com/avatares/4.png',
      'https://storage.cloud.google.com/avatares/5.png',
      'https://storage.cloud.google.com/avatares/6.png',
      'https://storage.cloud.google.com/avatares/7.png',
      'https://storage.cloud.google.com/avatares/8.png',
      'https://storage.cloud.google.com/avatares/9.png',
      'https://storage.cloud.google.com/avatares/10.png',
      'https://storage.cloud.google.com/avatares/11.png',
      'https://storage.cloud.google.com/avatares/12.png',
      'https://storage.cloud.google.com/avatares/13.png',
      'https://storage.cloud.google.com/avatares/14.png',
      'https://storage.cloud.google.com/avatares/15.png',
      'https://storage.cloud.google.com/avatares/16.png',
      'https://storage.cloud.google.com/avatares/17.png',
      'https://storage.cloud.google.com/avatares/18.png',
      'https://storage.cloud.google.com/avatares/19.png',
      'https://storage.cloud.google.com/avatares/20.png',
    ];
    res.json(avatars);
  } catch (error) {
    console.error('Error al obtener avatares:', error);
    res.status(500).json({ error: 'Error al obtener avatares' });
  }
});

// Ruta para obtener todas las asistencias
app.get('/admin/attendances', authenticateToken, async (req, res) => {
  try {
    const query = 'SELECT * FROM attendances';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener asistencias:', error);
    res.status(500).json({ message: 'Error al obtener los registros de asistencias' });
  }
});

// Ruta para actualizar una asistencia específica
app.put('/admin/attendance/update', authenticateToken, async (req, res) => {
  const { id, data } = req.body;
  const { fecha, act_eleccion_juego, act_perder, negociar, convivencia, comentarios, nino_id, coach_id } = data;

  try {
    const query = `
      UPDATE attendances SET
        fecha = $1,
        act_eleccion_juego = $2,
        act_perder = $3,
        negociar = $4,
        convivencia = $5,
        comentarios = $6,
        nino_id = $7,
        coach_id = $8
      WHERE id = $9
      RETURNING *;
    `;
    const values = [fecha, act_eleccion_juego, act_perder, negociar, convivencia, comentarios, nino_id, coach_id, id];
    const result = await pool.query(query, values);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar asistencia:', error);
    res.status(500).json({ message: 'Error al actualizar el registro de asistencia' });
  }
});


// Inicia el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en ${PORT}`);
});
