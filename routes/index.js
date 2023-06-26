var express = require('express');
var router = express.Router();
var database = require('../database');

router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Express' });
});

router.get('/view', function(req, res, next) {
  const userId = req.query.id;

  database.getUserById(userId, function(err, user) {
    if (err) {
      console.error('Error retrieving user:', err);
      return res.render('view', { title: 'Express', error: 'Error retrieving user' });
    }

    res.render('view', { title: 'Express', user: user[0] }); 
  });
});

router.get('/adduser', function(req, res, next) {
  res.render('add', { title: 'Express' });
});


router.post('/adduser', function(req, res, next) {
  const { name, email, mobile, password } = req.body;

  if (!name || !email || !mobile || !password) {
    return res.render('add', { title: 'Express', error: 'Please fill in all fields' });
  }

  database.createUser(name, email, mobile, password, function(err, result) {
    if (err) {
      console.error('Error creating user:', err);
      return res.render('add', { title: 'Express', error: 'Error creating user' });
    }

    res.redirect('/dashboard');
  });
});


router.get('/update', function(req, res, next) {
  const userId = req.query.id;

  database.getUserById(userId, function(err, user) {
    if (err) {
      console.error('Error retrieving user:', err);
      return res.render('update', { title: 'Express', error: 'Error retrieving user' });
    }

    res.render('update', { title: 'Express', user: user[0] }); 
  });
});

router.get('/dashboard', function(req, res, next) {
  const searchTerm = req.query.search; 

  database.getUsers(searchTerm, function(err, users) {
    if (err) {
      console.error('Error retrieving users:', err);
      return res.render('dashboard', { title: 'Express', error: 'Error retrieving users' });
    }

    res.render('dashboard', { title: 'Express', users: users, searchTerm: searchTerm }); 
  });
});


router.post('/register', function(req, res, next) {
  const { name, email, mobile, password, cpassword } = req.body;

  if (password !== cpassword) {
    return res.render('register', { title: 'Express', error: 'Passwords do not match' });
  }

  database.createUser(name, email, mobile, password, function(err, result) {
    if (err) {
      console.error('Error creating user:', err);
      return res.render('register', { title: 'Express', error: 'Error creating user' });
    }

    res.redirect('/');
  });
});

router.post('/update', function(req, res, next) {
  const { id, name, email, mobile, password } = req.body;

  database.updateUser(id, name, email, mobile, password, function(err, result) {
    if (err) {
      console.error('Error updating user:', err);
      return res.render('update', { title: 'Express', error: 'Error updating user', user: req.body });
    }

    res.redirect('/dashboard');
  });
});

router.post('/delete', function(req, res, next) {
  const { id } = req.body;

  database.deleteUser(id, function(err, result) {
    if (err) {
      console.error('Error deleting user:', err);
      return res.render('dashboard', { title: 'Express', error: 'Error deleting user' });
    }

    res.redirect('/dashboard');
  });
});

router.post('/login', function(req, res, next) {
  const { email, password } = req.body;

  database.getUserByEmailAndPassword(email, password, function(err, result) {
    if (err) {
      console.error('Error retrieving user:', err);
      return res.render('login', { title: 'Express', error: 'Error retrieving user' });
    }

    if (result.length === 0) {
      return res.render('login', { title: 'Express', error: 'Invalid email or password' });
    }

    res.redirect('/dashboard');
  });
});

module.exports = router;


