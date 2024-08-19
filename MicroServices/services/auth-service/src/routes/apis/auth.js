const router = require('express').Router();
const UserAccount = require('../../models/UserAccount');
const role = require('../../middlewares/role');
const passport = require('passport');
const { ROLES } = require('../../../../../common/constants');
const jwt = require('jsonwebtoken');
const auth = require('../../../../../common/api-proxy/src/middlewares/auth');
require('dotenv').config();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username && !password) {
        return res.status(400).json({ message: "You must enter username and passowrd" });
    }
    const userAccount = await UserAccount.findOne({ username: username });
    if (!userAccount || !userAccount.validatePassword(password)) {
        return res.status(400).json({ message: "Check your creds" });
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


// GET ALL USERS. ONLY (ADMIN) CAN RETRIEVE THEM. 
router.get('/', auth, role.check(ROLES.Admin), async(req, res) =>{
    try {
        const userAccounts = await UserAccount.find().select('username role').sort({ createdAt: -1 });
        if(!userAccounts.length > 0)
        {
            return res.status(400).json({Message: "There is no users in this moment."})
        }else{
            return res.status(200).json({Users: userAccounts});

        }

    }catch(err) {
        console.log(err);
        res.status(400).send('Request faild. Try again.')
    }
});


router.get('/:id', auth, async (req, res) => {  
    try {  
     
        const userAccount = await UserAccount.findById(req.params.id).select('username role');  
        
         
        if (!userAccount) {  
            return res.status(404).json({ Message: "User not found." });  
        }  

        if (req.user.role === ROLES.Admin || req.user._id.toString() === req.params.id) {  
            return res.status(200).json({ User: userAccount });  

        }else {  
            return res.status(403).json({ Message: 'You are not allowed to make this request.' });  
        } 


    }catch(err) {
        console.log(err);
        res.status(400).send('Request faild. Try again.')
    }
});



router.put('/:id', auth, async (req, res) => {  
    try {  
        const userToUpdate = await UserAccount.findById(req.params.id);  


        if(!userToUpdate) {
            return res.status(400).json({Message: "User not found."})
        }

        const { username, password } = req.body;  

        if (req.user.role === ROLES.Admin || req.user.id === userToUpdate._id.toString()){  
             
            if(username) {  
                userToUpdate.username = username;  
            }  
            if(password) {  
                userToUpdate.setPassword(password);
            }  

            await userToUpdate.save(); 
            return res.status(200).json({ User_updated_successfully: userToUpdate});  
        }  

        return res.status(400).json({ Message: 'Unexpected error' });  

    }catch (err) {  
        console.log(err);  
        res.status(400).send('Request failed. Try again.');  
    }  
});



router.delete('/:id', auth, async(req, res) =>{
        try {

            const userToDelete = await UserAccount.findById(req.params.id)
            if(!userToDelete) {
                return res.status(400).json({Message: "User not found."})
            }


            if(req.user.role === ROLES.Admin || req.user.id === userToDelete._id.toString()){

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