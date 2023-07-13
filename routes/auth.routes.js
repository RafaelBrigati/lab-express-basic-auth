const bcrypt = require('bcrypt');
const saltRounds = 10;

const router = require("express").Router();

const User = require('../models/User.model');

const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

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
router.get("/profile", isLoggedIn, (req, res, next) => {
  if (req.session.currentUser){
    User.findOne({username: req.session.currentUser.username})
    then( foundUser => {
      console.log('found User', foundUser);
      foundUser.loggedIn = true;
      res.render('auth/profile', foundUser)
    })
    .catch(err => console.log(err))
  }
  else {
    res.render('auth/profile')
  }
});

//xxx
router.get("/login", (req, res, next) => {
    res.render('auth/login');
});

router.post('/login', (req, res, next) => {
    const { email, password } = req.body;
   
    if (email === '' || password === '') {
      res.render('/login', {
        errorMessage: 'Please enter both, email and password to login.'
      });
      return;
    }
   
    User.findOne({ email })
      .then(user => {
        if (!user) {
          res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
          return;
        } else if (bcrypt.compareSync(password, user.passwordHash)) {
          res.render('auth/profile', { user });
        } else {
          res.render('auth/login', { errorMessage: 'Incorrect password.' });
        }
      })
      .catch(error => next(error));
  });


module.exports = router;