const handleSignIn = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('incorrect form submission');
  }
  db.select('email', 'hash')
    .from('login')
    .where('email', email)
    .then((data) => {
      if (bcrypt.compareSync(password, data[0].hash)) {
        return db
          .select('*')
          .from('users')
          .where('email', email)
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
