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

router.post('/user-account/register', passport.authenticate('jwt', { session: false }), role.check(ROLES.Admin), async (req, res) => {
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

// Get all users.
router.get('/user-account', 
    passport.authenticate('jwt', { session: false }), role.check(ROLES.Admin, ROLES.Member), async(req, res) =>{
    try {
        const userAccounts = await UserAccount.find().sort({ createdAt: -1 });
        
        if(!userAccounts.length > 0) return res.status(400).json({Message: "There is no users in this moment."})
        
            return res.status(200).json({Users: userAccounts});

    }catch(err) {
        console.log(err);
        res.status(400).send('Request faild. Try again.')
    }
});


// Get specific user.
router.get('/user-account/:id', 
    passport.authenticate('jwt', { session: false }), role.check(ROLES.Admin, ROLES.Member), async(req, res) =>{
    try {
        const userAccount = await UserAccount.findById(req.params.id);
        if(!userAccount) return res.status(400).json({Message: "User not found."})
            // Member can't check admin's data.
            if(req.user.role === ROLES.Member && userAccount.role === ROLES.Admin) return res.
            status(400)
            .json({Message: "Faild to access."})

            return res.status(200).json({User: userAccount});

    }catch(err) {
        console.log(err);
        res.status(400).send('Request faild. Try again.')
    }
});



// Update user.
router.put('/user-account/:id', 
    passport.authenticate('jwt', { session: false }), role.check(ROLES.Admin, ROLES.Member), async(req, res)=>{
    try {
        const userToUpdate = await UserAccount.findById(req.params.id)
        const {username, password} = await req.body;
        
        
        if(req.user.role === ROLES.Admin || req.user.id === userToUpdate.id){
            
            if(userToUpdate.username !== req.body.username || userToUpdate.password !== req.body.password){
                userToUpdate.username = req.body.username;
                userToUpdate.password = req.body.password;
                await userToUpdate.save();
                return res.status(200).json({User_updated_successfully: userToUpdate});
            }else{
                res.status(400).json({Message: "Nothing have changed."})
            }
        };
        // Cases -> if user role is member and trying to update admin..
        return res.status(400).json({Message: 'Credential error'})
        
    }catch(err) {
        console.log(err);
        res.status(400).send('Request faild. Try again.')
    }
});


// Delete user.
router.delete('/user-account/:id',
    passport.authenticate('jwt', { session: false }), role.check(ROLES.Admin, ROLES.Member), async(req, res) =>{
        
        try {
            const userToDelete = await UserAccount.findById(req.params.id)
            if(!userToDelete) return res.status(400).json({Message: "User not found."})
                
                if(req.user.role === ROLES.Admin || req.user.id === userToDelete.id){
                    await UserAccount.findByIdAndDelete(req.params.id);
                    return res.status(200).json({Message: 'User deleted successfully.'})
                }

            return res.status(400).json({Message: 'Credential error'})
                
            }catch(err) {
                console.log(err);
                res.status(400).send('Request faild. Try again.')
            }
        }
)

module.exports = router;