const { Router } = require('express');

const router = Router();

/**
 * @route:  GET points/api/player/:userId
 * @access: Private
 */

router.get('/:userId', (req, res) => {
    console.log(req.params);
    return res.send('asfdg');
});

/**
 * @route:  GET points/api/player/:userId/history
 * @access: Private
 */

router.get('/:userId/history', (req, res) => {
    console.log(req.params);
    return res.send('asfdg');
});


module.exports = router;