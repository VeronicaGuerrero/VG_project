const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const controller = require('../controllers/mensaje');

router.get('/', authController.isLoggedIn, (req, res) => {
    res.render('index', {
        user: req.user
    });
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/admin', (req, res) => {
    res.render('admin');
})

router.get('/profile', authController.isLoggedIn, (req, res) => {
    if (req.user) {
        res.render('profile', {
            user: req.user
        });
    } else {
        res.redirect('/login');
    }

})

router.get('/homePage', (req, res) => {
    res.render('homePage');
});

router.get('/quiz', (req, res) => {
    res.render('quiz');
});

router.get('/test1', (req, res) => {
    res.render('test', {cdnmsql: '<script src="https://cdn.jsdelivr.net/npm/nodejs-mysql@0.1.3/index.js"></script>'} );
});

router.post('/test', controller.Mensaje);

router.get('/extrovert', (req, res) => {
    res.render('extrovert');
});

router.get('/introvert', (req, res) => {
    res.render('introvert');
});

router.get('/ambivert', (req, res) => {
    res.render('ambivert');
});

router.get('/shy', (req, res) => {
    res.render('shy');
});

router.get('/determined', (req, res) => {
    res.render('determined');
});

module.exports = router;