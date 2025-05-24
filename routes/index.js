const router = require('express').Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
    //#swagger.tags=['Hello World']
    res.send('Hello World!');
});

router.use('/projects', require('./projects'));
router.use('/tasks', require('./tasks'));
router.use('/users', require('./users'));

module.exports = router;
