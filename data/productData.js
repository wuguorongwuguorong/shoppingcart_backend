const pool = require('../database');


async function getProductByName(name) {
  if (!name || typeof name !== 'string') {
    throw new Error('Invalid name');
  }
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE name = ?', [name]);
    return rows[0];
  } catch (e) {
    console.log(e);
    throw e;
  }
}

async function createProduct({ name, price, image }) {
  if (!name || !price || typeof name !== 'string' || typeof price !== 'decimal') {
    throw new Error('Invalid product data');
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Insert user data
    const [productResult] = await connection.query(
      `INSERT INTO products (name, price, image) VALUES (?, ?, ?)`,
      [name, price, image]
    );
    const productId = productResult.insertId;


    await connection.commit();
    return productId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function getAllProducts() {
  const [rows] = await pool.query(`SELECT id, name, CAST(price AS DOUBLE) AS price, image FROM products`);
  return rows;
}

async function getProductById(id) {
  const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
  return rows[0];
}


module.exports = {
  getAllProducts,
  getProductById,
  getProductByName,
  createProduct
};