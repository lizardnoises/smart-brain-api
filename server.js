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

const { handleRegister } = require('./controllers/register');
const { handleSignIn } = require('./controllers/sign-in');
const { handleProfileGet } = require('./controllers/profile');
const { handleImage, handleApiCall } = require('./controllers/image');

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

app.get('/', () => {});
app.post('/signin', handleSignIn(db, bcrypt));
app.post('/register', handleRegister(db, bcrypt));
app.get('/profile/:id', handleProfileGet(db));
app.put('/image', handleImage(db));
app.post('/imageurl', handleApiCall);

app.listen(3000, () => {
  console.log('app is listening on port 3000');
});
