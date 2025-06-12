const express = require('express');
const router = express.Router();
const User= require('./models/user');


router.post('', async (req, res)=>{
    let user = new User({
        //https://expressjs.com/en/5x/api.html#req.body
        username: req.body.username,
        email: req.body.email,
        name: req.body.name,
        surname: req.body.surname,
        password: req.body.password
    });

    if (!user.name || typeof user.name != 'string') {
            res.status(400).json({ error: '"Name" must be a non-empty string' });
            return;
        } 
        
        if (!user.surname || typeof user.surname != 'string') {
            res.status(400).json({ error: '"Surname" must be a non-empty string' });
            return;
        }
    if(!user.email || !checkIfEmailInString(user.email) ){
        res.status(400).json({ error: 'The field "email" must be a non-empty string, in email format' });
        return;
    }
    if(!user.username || checkUsername(user.username)){
        res.status(400).json({ error: 'The filed "username" must be a non-empty stiring, between 3 and 20 character. It cannot be already used by an another user'});
        return;
    }
    if(!user.password || CheckPassword(user.password)){
        res.status(400).json({ error: 'The field "password" must be a string with at least 8 characters. It needs to contain: at least 1 upcase letter, 1 lowercase letter, a number and a special character (~!@#$% ^&*_-+=`|\(){}[]:;"<>,.?/)'});
        return;
    }

    book = await user.save();

    let userId = user._id;

    console.log('New user created with id: ' + userId);

    res.location('/api/v1/users/' + userId);
    res.status(201).json({
        self: '/api/v1/users/' + userId,
        id: userId,
        username: user.username,
        email: user.email,
        name: user.name,
        surname: user.surname
    });
});

router.get('', async (req, res)=>{
    //https://mongoosejs.com/docs/api/model.html#Model.find()
    let users =await User.find({});
    users = users.map(user => {
        return {
            self: '/api/v1/users/' + user.userId,
            id: user.userId,
            username: user.username,
            email: user.email,
            name: user.name,
            surname: user.surname
        };
    });
    res.status(200).json(users);
});

router.get('/:id', async (req, res)=>{
    try{
        //https://expressjs.com/en/5x/api.html#req.params
       let userId = req.params.id;
       //https://mongoosejs.com/docs/api/model.html#Model.findById()
        let user = await User.findById(userId);
    
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            self: '/api/v1/users/' + user._id,
            id: user._id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        }); 
    } catch(error){
        res.status(500).json({ error: 'Internal server error' });
    }
});
//https://expressjs.com/en/guide/routing.html#route-parameters
router.get('',async (req,res) =>{
    try{
        let users;

        if(req.query.username){
            users = await Users.find({username: req.query.username}).exec();
            if(!users || users.length === 0){
                return res.status(404).json({error: 'No users found with that username'});
            }
        }else{
            users = await Users.find().exec();
        }

        users = users.map( (user) =>{
            return{
                self: '/api/v1/students/'+ user.id,
                username: user.username,
                email: user.email, 
                name: user.name,
                surname: user.surname
            }
        })
    }catch(error){
        console.error('Error fetching users:', error);
        return res.status(500).json({error: 'Internal server error'});
    }
})

router.put('/:id',async (req, res) =>{
    try{
        let userId = req.params.id;
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user fields
        if (req.body.username) user.username = req.body.username;
        if (req.body.email) user.email = req.body.email;
        if (req.body.name) user.name = req.body.name;
        if (req.body.surname) user.surname = req.body.surname;

        await user.save();

        res.status(200).json({
            self: '/api/v1/users/' + user._id,
            id: user._id,
            username: user.username,
            email: user.email,
            name: user.name,
            surname: user.surname
        });
    }catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.delete('/:id', async (req, res) => {
    try {
        let userId = req.params.id;
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.remove();

        res.status(204).send(); // No content
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function checkIfEmailInString(text) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
}

async function checkUsername(username){
    if(username.length < 3 || username.leght > 20)
        return false;
    else{
        let u;
        u = await Users.find({username: username});
        if(u.lenght != 0 ){
            return false;
        }
        return true;
    }
}

//https://stackoverflow.com/questions/63118717/how-do-i-validate-a-password-using-regular-expressions
function CheckPassword(inputtxt) {
    var decimal = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,50}$/;
    if (inputtxt.value.match(decimal)) {
        return true;
    } else {
        return false;
    }
}