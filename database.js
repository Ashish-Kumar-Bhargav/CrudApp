const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'system',
  database: 'users'
});

function executeQuery(query, params, callback) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      callback(err, null);
    } else {
      connection.query(query, params, (err, rows) => {
        connection.release();
        callback(err, rows);
      });
    }
  });
}

function getUsers(searchTerm, callback) {
  let query = 'SELECT * FROM users';

  if (searchTerm) {
    query += ' WHERE name LIKE ? OR email LIKE ? OR mobile LIKE ?';
  }

  const params = searchTerm ? [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`] : [];

  executeQuery(query, params, callback);
}


function createUser(name, email, mobile, password, callback) {
  const query = 'INSERT INTO users (name, email, mobile, password) VALUES (?, ?, ?, ?)';
  const params = [name, email, mobile, password];
  executeQuery(query, params, callback);
}

function updateUser(id, name, email, mobile, password, callback) {
  const query = 'UPDATE users SET name = ?, email = ?, mobile = ?, password = ? WHERE id = ?';
  const params = [name, email, mobile, password, id];
  executeQuery(query, params, callback);
}

function getUserById(id, callback) {
  const query = 'SELECT * FROM users WHERE id = ?';
  const params = [id];
  executeQuery(query, params, callback);
}

function deleteUser(id, callback) {
  const query = 'DELETE FROM users WHERE id = ?';
  const params = [id];
  executeQuery(query, params, callback);
}

function getUserByEmailAndPassword(email, password, callback) {
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  const params = [email, password];
  executeQuery(query, params, callback);
}

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  getUserByEmailAndPassword
};


