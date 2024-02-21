
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.REACT_APP_MYSQL_PASSWORD,
  database: 'outings',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database');
});

// Secret key for JWT
const secretKey = '264e22aa3e0766c2a1b61f409a7801515ecb8b9faa765205ded8c6737e1439cf';

// Middleware to authenticate JWT tokens
function authenticateToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = user;
    next();
  });
}

// API route for user registration
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Hash the password before storing it in the database
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(sql, [username, hash], (err) => {
      if (err) {
        console.log(err)
        res.status(400).json({ message: 'Could not add user' });
        return;
      }
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

// API route for user login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], (err, results) => {
    if (err || results.length === 0) {
      res.status(401).json({ message: 'Invalid username or password' });
      return;
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) {
        res.status(401).json({ message: 'Invalid username or password' });
        return;
      }

      const token = jwt.sign({ username: user.username }, secretKey);
      const id = user.idusers;
      res.json({ token, id});
    });
  });
});

app.get('/find', (req,res)=> {
  const {username} = req.query

  const sql = 'SELECT idusers FROM users WHERE username = ?'
  db.query(sql, [username], (err, results) =>{
    console.log(sql);
    if (err) {
      console.error('Error executing the query: ' + error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = results[0];
    const id = user.idusers;
    res.json({id});
  })
});

app.get('/getconnections', (req,res)=> {
  const user = req.query.user;

  const sql = 'SELECT * FROM connections WHERE user1 = ? OR user2 = ?';
  db.query(sql, [user, user], (err, results) =>{
    if(err){
      console.error('Error executing the query: ' + err.message);
      return res.status(400).json({ err: 'Internal server error' });
    }
    if(results.length == 0){
      return res.status(404).json({err: 'Connection not found'});
    }
    const connections = results;
    res.json({connections});
  })
});

app.get('/matches', (req,res)=>{
  const connection = req.query.connection;

  const sql = 'SELECT * FROM likes WHERE connection = ?';
  db.query(sql,[connection], (err,results)=>{
    if(err){
      console.error('Error executing the query: ' + err.message);
      return res.status(400).json({ err: 'Internal server error' });
    }
    const matches = results;
    res.json({matches});
  })
});

app.post('/connections', authenticateToken, (req, res) => {
  const {user1, username1, user2, username2} = req.body;

  const sql = 'INSERT INTO connections (user1, username1, user2, username2) VALUES (?, ?, ?, ?)';
  db.query(sql, [user1, username1, user2, username2], (err, result) => {
    if (err) {
      console.log(err)
      res.status(400).json({ message: 'Could not add connections' });
      return;
    }
    const insertedId = result.insertId;
    res.status(201).json({id: insertedId, message: 'Connection registered successfully' });
  });
});

app.post('/likes', authenticateToken, (req, res) => {
  const {user, connection, name, url, rating, price, reference} = req.body;

  const sql = 'INSERT INTO likes (user, connection, name, url, rating, price, reference) VALUES (?, ?, ?, ?, ?, ?, ?)';

  db.query(sql, [user, connection, name, url, rating, price, reference], (err) =>{
    if(err) {
      console.log(err)
      res.status(400).json({message: 'Could not add connections'});
      return;
    }
    res.status(201).json({message: 'Like registered successfully'});
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
