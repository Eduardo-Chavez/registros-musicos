const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  console.log(req.body);
  const rows = await pool.query('SELECT * FROM usuario WHERE username = ?', [username]);
  if (rows.length > 0) {
    const user = rows[0];
    const validPasssword = helpers.matchPassword(password, user.password);
    if(validPasssword){
      done(null, user, req.flash('success', 'Bienvenido ' + user.username));
    } else {
      done (null, false, req.flash('message', 'La contraseña es incorrecta'));
    }
  } else {
    return done (null, false, req.flash('message', 'El nombre de usuario no existe'));
  }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {

    const { nombre } = req.body;
    const { apellidos } = req.body;
    let newUser = {
        nombre,
        apellidos,
        username,
        password
      };
      newUser.password = await helpers.encryptPassword(password);
      const result = await pool.query('INSERT INTO usuario SET ?', [newUser]);
      newUser.cveUsuario = result.insertId;
      return done(null, newUser);
}));

passport.serializeUser((user, done) => {
  done(null, user.cveUsuario);
});

passport.deserializeUser(async (cveUsuario, done) => {
    const rows = await pool.query('SELECT * FROM usuario WHERE cveUsuario = ?', [cveUsuario]);
    done(null, rows[0]);
  });