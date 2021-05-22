const handleProfileGet = (db) => (req, res) => {
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
};

exports.handleProfileGet = handleProfileGet;
