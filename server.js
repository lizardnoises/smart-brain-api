// Endpoints:
// / --> res = this is working
// /signin --> POST = success/failure
// /register --> POST = user
// /profile/:userId --> GET = user
// /image --> PUT --> user

const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const database = {
  users: [
    {
      id: 123,
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date(),
    },
    {
      id: 124,
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.get('/', (req, res) => {
  res.json(database.users);
});

app.post('/signin', (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json('error logging in');
  }
});

app.post('/register', (req, res) => {
  const { email, password, name } = req.body;
  database.users.push({
    id: 125,
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users[database.users.length - 1]);
});

app.get('/profile/:id', (req, res) => {
  const id = Number(req.params?.id);
  for (let user of database.users) {
    if (user.id === id) {
      res.json(user);
      return;
    }
  }
  res.status(400).json('not found');
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  for (let user of database.users) {
    if (user.id === id) {
      user.entries++;
      res.json(user);
      return;
    }
  }
  res.status(400).json('not found');
});

app.listen(3000, () => {
  console.log('app is listening on port 3000');
});
