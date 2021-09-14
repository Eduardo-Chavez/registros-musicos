const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add');
});

/*Para insertar los datos en la tabla departamento*/
router.post('/add', isLoggedIn, async (req, res) => {
    const { nombre, direccion, instrumento, fecha} = req.body;
    const newLink = {
        nombre,
        direccion,
        instrumento,
        fecha,
        cveEncargado: req.user.cveUsuario //Para las sesiones
    };
    await pool.query('INSERT INTO musico set ?', [newLink]);
    req.flash('success', 'Musico guardado correctamente.');
    res.redirect('/links');
});

/*Para mostrar la informacion de la tabla */
router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM musico WHERE cveEncargado = ?', [req.user.cveUsuario]);
    res.render('links/list', {links});
});

/*Eliminar departamento*/
router.get('/delete/:cveMusico', isLoggedIn, async (req, res) => {
    const { cveMusico } = req.params;
    req.flash('success', 'Se elimino por completo el Musico');
    await pool.query('DELETE FROM musico WHERE cveMusico = ?', [cveMusico]);
    res.redirect('/links');
});

/*Para editar los registros*/
router.get('/edit/:cveMusico', isLoggedIn, async (req, res) => {
    const { cveMusico } = req.params;
    const links = await pool.query('SELECT * FROM musico Where cveMusico = ?', [cveMusico]);
    res.render('links/edit', {link: links[0]})
});

router.post('/edit/:cveMusico', isLoggedIn, async (req, res) => {
    const { cveMusico } = req.params;
    const { nombre, direccion, instrumento, fecha } = req.body;
    const newLink = {
        nombre,
        direccion,
        instrumento,
        fecha
    };
    req.flash('success', 'Se actualizo correctamente el Musico.');
    await pool.query('UPDATE musico set ? WHERE cveMusico = ?', [newLink, cveMusico]);
    res.redirect('/links');
});

module.exports = router;