// Endpoints:
// / --> res = this is working
// /signin --> POST = success/failure
// /register --> POST = user
// /profile/:userId --> GET = user
// /image --> PUT --> user

const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'penguin',
    database: 'smart-brain',
  },
});

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {});

app.post('/signin', (req, res) => {
  db.select('email', 'hash')
    .from('login')
    .where('email', req.body.email)
    .then((data) => {
      if (bcrypt.compareSync(req.body.password, data[0].hash)) {
        return db
          .select('*')
          .from('users')
          .where('email', req.body.email)
          .then((users) => {
            res.json(users[0]);
          })
          .catch((err) => res.status(400).json('unable to get user'));
      } else {
        res.status(400).json('wrong credentials');
      }
    })
    .catch((err) => res.status(400).json('wrong credentials'));
});

app.post('/register', (req, res) => {
  const { email, password, name } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  db.transaction((trx) => {
    trx
      .insert({
        hash,
        email,
      })
      .into('login')
      .returning('email')
      .then((loginEmail) => {
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0],
            name,
            joined: new Date(),
          })
          .then((users) => {
            res.json(users[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json('unable to register'));
});

app.get('/profile/:id', (req, res) => {
  const id = Number(req.params?.id);
  db.select('*')
    .from('users')
    .where({ id })
    .then((users) => {
      if (users.length) {
        res.json(users[0]);
      } else {
        res.status(400).json('not found');
      }
    })
    .catch((err) => res.status(400).json('error getting user'));
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => res.json(entries[0]))
    .catch((err) => res.status(400).json('unable to get entries'));
});

app.listen(3000, () => {
  console.log('app is listening on port 3000');
});
