/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const router = require('express').Router();
const passport = require('passport');
const { isAuthenticated } = require('../middleware/authenticate');

console.log('isAuthenticated:', typeof isAuthenticated, isAuthenticated);
router.use('/swagger', require('./swagger'));

router.use('/projects', isAuthenticated, require('./projects'));
router.use('/tasks', isAuthenticated, require('./tasks'));
router.use('/users', isAuthenticated, require('./users'));


router.get('/login', passport.authenticate('github'), (req, res) => {});

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.session.destroy();
        res.redirect('/');
    });
});

router.get('/auth/status', (req, res) => {
    if (req.session.user) {
        res.json({
            autheniticated: true,
            user: {
                username: req.session.user.username,
                displayName: req.session.user.displayName,
                role: req.session.user.role
            }
        });
    } else {
        res.json({
            authenticated: false,
            message: "Not logged in"
        });
    }
});

module.exports = router;
