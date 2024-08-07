const router = require('express').Router();
const Profile = require('../../models/Profile');
const role = require('../../middlewares/role');
const passport = require('passport');
const { ROLES } = require('../../constants');

router.post('/register', passport.authenticate('local', { session: false }), role.check(ROLES.Admin), async (req, res) => {
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

        const existingProfile = await Profile.findOne({ username });

        if (existingProfile) {
            return res
                .status(400)
                .json({ error: 'That username is already in use.' });
        }
        const profile = new Profile({
            username,
            password
        });
        profile.setPassword(password);
        await profile.save();

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