const pool = require('../database');

async function getUserByEmail(email) {
  if (!email || typeof email !== 'string') {
    throw new Error('Invalid email');
  }
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  } catch (e) {
    console.log(e);
    throw e;
  }
}

async function getUserById(id) {
  if (!id || typeof id !== 'number') {
      throw new Error('Invalid user ID');
  }
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
}

async function createUser({ name, email, password, salutation, country, marketingPreferences }) {
  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    throw new Error('Invalid user data');
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Insert user data
    const [userResult] = await connection.query(
      `INSERT INTO users (name, email, password, salutation, country) VALUES (?, ?, ?, ?, ?)`,
      [name, email, password, salutation, country]
    );
    const userId = userResult.insertId;

    // Insert marketing preferences
    if (Array.isArray(marketingPreferences)) {
      for (const preference of marketingPreferences) {
        // Retrieve preference ID from marketing_preferences table
        const [preferenceResult] = await connection.query(
          `SELECT id FROM marketing_preferences WHERE preference = ?`,
          [preference]
        );

        // Check if the preference exists
        if (preferenceResult.length === 0) {
          throw new Error(`Invalid marketing preference: ${preference}`);
        }

        const preferenceId = preferenceResult[0].id;

        // Insert into user_marketing_preferences table
        await connection.query(
          `INSERT INTO user_marketing_preferences (user_id, preference_id) VALUES (?, ?)`,
          [userId, preferenceId]
        );
      }
    }

    await connection.commit();
    return userId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}



async function updateUser(id, { name, email, password, salutation, country, marketingPreferences }) {
  if (!id || !email || !password || typeof id !== 'number' || typeof email !== 'string' || typeof password !== 'string') {
    throw new Error('Invalid user data');
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Update user data
    await connection.query(
      `UPDATE users SET name = ?, email = ?, password = ?, salutation = ?, country = ? WHERE id = ?`,
      [name, email, password, salutation, country, id]
    );

    // Update marketing preferences by deleting existing ones and inserting new ones
    await connection.query(`DELETE FROM user_marketing_preferences WHERE user_id = ?`, [id]);
    if (Array.isArray(marketingPreferences)) {
      for (const preference of marketingPreferences) {
        await connection.query(
          `INSERT INTO user_marketing_preferences (user_id, preference) VALUES (?, ?)`,
          [id, preference]
        );
      }
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function deleteUser(id) {
  if (!id || typeof id !== 'number') {
      throw new Error('Invalid user ID');
  }

  const connection = await pool.getConnection();
  try {
      await connection.beginTransaction();

      // Delete marketing preferences
      await connection.query(`DELETE FROM user_marketing_preferences WHERE user_id = ?`, [id]);

      // Delete user
      await connection.query(`DELETE FROM users WHERE id = ?`, [id]);

      await connection.commit();
  } catch (error) {
      await connection.rollback();
      throw error;
  } finally {
      connection.release();
  }
}


module.exports = {
  getUserByEmail,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};