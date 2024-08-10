const router = require('express').Router();
const UserAccount = require('../../models/UserAccount');
const role = require('../../middlewares/role');
const passport = require('passport');
const { ROLES } = require('../../../../../common/constants');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username && !password) {
        return res.status(400).json({ message: "You must enter username and passowrd" });
    }
    const userAccount = await UserAccount.findOne({ username: username });
    if (!userAccount) {
        return res.status(400).json({ message: "This UserAccount does not exists" });
    }
    const payload = {
        userAccountId: userAccount._id,
    };
    const tokenValue = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ access_token: tokenValue });
});

router.post('/register', passport.authenticate('jwt', { session: false }), role.check(ROLES.Admin), async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username) {
            return res
                .status(400)
                .json({ error: 'You must enter an username.' });
        }

        if (!password) {
            return res.status(400).json({ error: 'You must enter a password.' });
        }

        const existingUserAccount = await UserAccount.findOne({ username });

        if (existingUserAccount) {
            return res
                .status(400)
                .json({ error: 'That username is already in use.' });
        }
        const userAccount = new UserAccount({
            username,
            password
        });
        userAccount.setPassword(password);
        await userAccount.save();

        res.status(200).json({
            success: true,
        });
    } catch (err) {
        console.log('Error occured ======> ', err);
        res.status(400).json({
            error: 'Your request could not be processed. Please try again.'
        });
    }
});

module.exports = router;