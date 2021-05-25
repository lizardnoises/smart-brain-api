const handleRegister = (db, bcrypt) => (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json('incorrect form submission');
  }
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
};

exports.handleRegister = handleRegister;
