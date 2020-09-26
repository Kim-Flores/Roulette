var ObjectID = require('mongodb').ObjectID
module.exports = function(app, passport, db) {

  // normal routes ===============================================================

      // show the home page (will also have our login links)
      app.get('/', function(req, res) {
          res.render('index.ejs');
      });

      // PROFILE SECTION =========================
      app.get('/profile', isLoggedIn, function(req, res) {
          db.collection('data').find().toArray((err, result) => {
            if (err) return console.log(err)
            res.render('profile.ejs', {
              user : req.user,
              data: result
            })
          })
      });
      // casino staff login retireves total

   // get casion id to use in the body


      // app.get('/staff', function(req, res) {
      // db.collection('data').find(total)(err, result) => {
      //   console.log(result)
      //   if (err) return console.log(err)
      //   res.render('staff.ejs', {
      //     messages: result
      //   })
      // })

      // LOGOUT ==============================
      app.get('/logout', function(req, res) {
          req.logout();
          res.redirect('/');
      });

  // message board routes ===============================================================

      app.post('/game', (req, res) => {
        db.collection('data').save({
          casinoTotal: req.body.casinoTotal,
          wins: req.body.wins,
          losses: req.body.losses}
           , (err, result) => {
          if (err) return console.log(err)
          console.log('saved to database')
          res.redirect('/')
        })
      })
      app.put('/game', (req, res) => {
        db.collection('data')
        .updateMany({wins: req.body.wins, losses: req.body.losses, casinoTotal: req.body.casinoTotal}, {
          $set: {
            wins: req.body.wins,
            losses: req.body.losses,
            casinoTotal: req.body.casinoTotal,
          }
        }, {
          sort: {_id: -1},
          upsert: true
        }, (err, result) => {
          if (err) return res.send(err)
          res.send(result)
        })
      })

//       db.grades.findOneAndUpdate(
//    { "name" : "R. Stiles" },
//    { $inc: { "points" : 5 } }
// )

      // app.put('/thumbDown', (req, res) => {
      //   db.collection('data')
      //   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
      //     $set: {
      //       thumbUp:req.body.thumbUp - 1
      //     }
      //   }, {
      //     sort: {_id: -1},
      //     upsert: true
      //   }, (err, result) => {
      //     if (err) return res.send(err)
      //     res.send(result)
      //   })
      // })
      // app.put('/game', (req, res) => {
      //   db.collection('data')
      //   .findOneAndUpdate({_id: new ObjectId(req.body.id)}, {
      //     $inc: {
      //       wins: req.body.wins,
      //       losses: req.body.losses,
      //       money: req.body.money,
      //     }
      //   }, {
      //     sort: {_id: -1},
      //     upsert: true
      //   }, (err, result) => {
      //     if (err) return res.send(err)
      //     res.send(result)
      //   })
      // })

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

      // locally --------------------------------
          // LOGIN ===============================
          // show the login form
          app.get('/login', function(req, res) {
              res.render('login.ejs', { message: req.flash('loginMessage') });
          });

          // process the login form
          app.post('/login', passport.authenticate('local-login', {
              successRedirect : '/profile', // redirect to the secure profile section
              failureRedirect : '/login', // redirect back to the signup page if there is an error
              failureFlash : true // allow flash messages
          }));

          // SIGNUP =================================
          // show the signup form
          app.get('/signup', function(req, res) {
              res.render('signup.ejs', { message: req.flash('signupMessage') });
          });

          // process the signup form
          app.post('/signup', passport.authenticate('local-signup', {
              successRedirect : '/profile', // redirect to the secure profile section
              failureRedirect : '/signup', // redirect back to the signup page if there is an error
              failureFlash : true // allow flash messages
          }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

      // local -----------------------------------
      app.get('/unlink/local', isLoggedIn, function(req, res) {
          var user            = req.user;
          user.local.email    = undefined;
          user.local.password = undefined;
          user.save(function(err) {
              res.redirect('/profile');
          });
      });

  };

  // route middleware to ensure user is logged in
  function isLoggedIn(req, res, next) {
      if (req.isAuthenticated())
          return next();

      res.redirect('/');
  }
