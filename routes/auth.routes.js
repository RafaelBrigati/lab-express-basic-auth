const bcrypt = require('bcrypt');
const saltRounds = 10;

const router = require("express").Router();

const User = require('../models/User.model');

/* GET home page */
router.get("/signup", (req, res, next) => {
  res.render('auth/signup')
});

//xxx
router.post("/signup", (req, res, next) => {
    console.log('req.body', req.body);
    const { username, email, password } = req.body;
 
    bcrypt
      .genSalt(saltRounds)
      .then(salt => bcrypt.hash(password, salt))
      .then(hashedPassword => {
        return User.create({
          username,
          email,
          passwordHash: hashedPassword
        });
      })
      .then(userFromDB => {
        console.log('Newly created user is: ', userFromDB);
        res.redirect('/auth/profile');
      })
      .catch(error => next(error));
  });

//xxx
router.get("/profile", (req, res, next) => {
    res.render('auth/profile')
});

module.exports = router;