const handleSignIn = (db, bcrypt) => (req, res) => {
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
};

exports.handleSignIn = handleSignIn;
