const bcrypt = require('bcrypt');
const pool = require('./db'); // Asegúrate de que esta ruta sea correcta

const saltRounds = 10;

async function encryptPasswords() {
  try {
    // Encriptar contraseñas de padres
    const parents = await pool.query('SELECT id, contrasena FROM parents');
    for (const parent of parents.rows) {
      const hashedPassword = await bcrypt.hash(parent.contrasena, saltRounds);
      await pool.query('UPDATE parents SET contrasena = $1 WHERE id = $2', [hashedPassword, parent.id]);
    }
    console.log('Contraseñas de padres encriptadas con éxito.');

    // Encriptar contraseñas de entrenadores
    const coaches = await pool.query('SELECT id, contrasena FROM coaches');
    for (const coach of coaches.rows) {
      const hashedPassword = await bcrypt.hash(coach.contrasena, saltRounds);
      await pool.query('UPDATE coaches SET contrasena = $1 WHERE id = $2', [hashedPassword, coach.id]);
    }
    console.log('Contraseñas de entrenadores encriptadas con éxito.');

    // encriptar contraseñas de admins
    const admins = await pool.query('SELECT id, contrasena FROM admins');
    for (const admin of admins.rows) {
      const hashedPassword = await bcrypt.hash(admin.contrasena, saltRounds);
      await pool.query('UPDATE admins SET contrasena = $1 WHERE id = $2', [hashedPassword, admin.id]);
    }
    console.log('Contraseñas de admins encriptadas con éxito.');
  } catch (error) {
    console.error('Error encriptando contraseñas:', error);
  } finally {
    pool.end(); // Cierra la conexión a la base de datos
  }
}

encryptPasswords();
