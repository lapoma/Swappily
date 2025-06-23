const express = require('express');
const router = express.Router();
const User = require('./models/user');
const bcrypt = require('bcrypt');
const tokenChecker = require('./authentication/tokenChecker.js');

// Email check
//https://stackoverflow.com/questions/63118717/how-do-i-validate-a-password-using-regular-expressions
function checkPassword(str) {
    var decimal = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,50}$/;
    return decimal.test(str);
}

// Username check
async function checkUsername(username) {
  if (!username || username.length < 3 || username.length > 20) return false;
  const existing = await User.find({ username });
  return existing.length === 0;
}

function checkIfEmailInString(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

// GET /me - Utente autenticato
router.get('/me', tokenChecker, async (req, res) => {
    console.log('[GET /me] req.loggedUser:', req.loggedUser);
    try {
      const user = await User.findById(req.loggedUser.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      return res.status(200).json({ username: user.username });
    } catch (err) {
      console.error('[GET /me] error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.get('', async (req, res) => {
  try {
    let users;
    if (req.query.username) {
      users = await User.find({ username: req.query.username });
      if (users.length == 0) {
        return res.status(404).json({ error: 'No users found with that username' });
      }
    } else {
      users = await User.find({});
    }

    users = users.map(user => ({
        self: '/api/v1/users/' + user._id,
        userId: user.userId,
        username: user.username,
        email: user.email,
        name: user.name,
        surname: user.surname,
        usertype: user.usertype,
        phone: user.phone,
        favorite: user.favorite,
        followed: user.followed,
        n_followed: user.n_followed,
        followers: user.followers,
        n_followers: user.n_followers,
        blocklist: user.blocklist,
        n_exchanges: user.n_exchanges
    }));

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({
        self: '/api/v1/users/' + user._id,
        userId: user.userId,
        username: user.username,
        email: user.email,
        name: user.name,
        surname: user.surname,
        usertype: user.usertype,
        phone: user.phone,
        favorite: user.favorite,
        followed: user.followed,
        n_followed: user.n_followed,
        followers: user.followers,
        n_followers: user.n_followers,
        blocklist: user.blocklist,
        n_exchanges: user.n_exchanges
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('', async (req, res) => {
    const { 
        userId,
        username,
        email,
        name,
        surname,
        password,
        usertype,
        phone,
        favorite,
        followed,
        n_followed,
        followers,
        n_followers,
        blocklist,
        n_exchanges} = req.body;
  
    if (!userId || typeof userId !== 'number') {
        return res.status(400).json({ error: '"userId" is required and must be a number' });
    }
    
    if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: '"Name" must be a non-empty string' });
    }
    
    if (!surname || typeof surname !== 'string') {
        return res.status(400).json({ error: '"Surname" must be a non-empty string' });
    }
    
    if (!email || !checkIfEmailInString(email)) {
        return res.status(400).json({ error: '"email" must be a valid email' });
    }
    
    const isUsernameValid = await checkUsername(username);
    if (!isUsernameValid) {
        return res.status(400).json({ error: '"username" must be 3-20 chars, and unique' });
    }
    
    if (!password || !checkPassword(password)) {
        return res.status(400).json({ error: 'Password must be 8+ chars with uppercase, lowercase, number, special char' });
    }
    
    if (!usertype || !['user', 'operator'].includes(usertype)) {
        return res.status(400).json({ error: '"usertype" must be either "user" or "operator"' });
    }
    
    if (typeof n_followed !== 'number' || typeof n_followers !== 'number' || typeof n_exchanges !== 'number') {
        return res.status(400).json({ error: '"n_followed", "n_followers", "n_exchanges" must be numbers' });
    }
  
    try {
        const hashedPassword = await bcrypt.hash(password, 10); // password criptata
        const user = new User({
            userId,
            username,
            email,
            name,
            surname,
            password: hashedPassword,
            usertype,
            phone,
            favorite: favorite || [],
            followed: followed || [], 
            n_followed,
            followers: followers || [], 
            n_followers,
            blocklist: blocklist || [], 
            n_exchanges
        });

        const savedUser = await user.save();

        res.location(`/api/v1/users/${savedUser._id}`);
        res.status(201).json({
            self: `/api/v1/users/${savedUser._id}`,
            userId: savedUser.userId,
            username: savedUser.username,
            email: savedUser.email,
            name: savedUser.name,
            surname: savedUser.surname,
            usertype: savedUser.usertype,
            phone: savedUser.phone,
            favorite: savedUser.favorite,            
            followed: savedUser.followed,
            n_followed: savedUser.n_followed,
            followers: savedUser.followers,
            n_followers: savedUser.n_followers,
            blocklist: savedUser.blocklist,
            n_exchanges: savedUser.n_exchanges
        });
    } catch (error) {        
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// PUT - aggiorna utente
router.put('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
  
        const {
            email, username, name, surname, password, usertype, phone,
            favorite, followed, n_followed, followers, n_followers, blocklist, n_exchanges
        } = req.body;

        if (!email || !checkIfEmailInString(email))
            return res.status(400).json({ error: 'The field "email" must be a valid email' });
  
        if (!username || username.length < 3 || username.length > 20)
            return res.status(400).json({
            error: 'The field "username" must be a non-empty string, 3-20 characters'
        });
  
        if (!name || typeof name !== 'string')
            return res.status(400).json({ error: '"Name" must be a non-empty string' });
  
        if (!surname || typeof surname !== 'string')
            return res.status(400).json({ error: '"Surname" must be a non-empty string' });
  
        if (password) {
            const isSame = await bcrypt.compare(password, user.password);
            if (isSame)
                return res.status(400).json({
                error: 'Password MUST be different from the previous one'
            });
            user.password = await bcrypt.hash(password, 10);
        }
  
        user.email = email;
        user.username = username;
        user.name = name;
        user.surname = surname;
        if (usertype) user.usertype = usertype;
        if (phone) user.phone = phone;
        if (favorite) user.favorite = favorite;
        if (followed) user.followed = followed;
        if (typeof n_followed === 'number') user.n_followed = n_followed;
        if (followers) user.followers = followers;
        if (typeof n_followers === 'number') user.n_followers = n_followers;
        if (blocklist) user.blocklist = blocklist;
        if (typeof n_exchanges === 'number') user.n_exchanges = n_exchanges;

  
        const updatedUser = await user.save();
  
        res.location(`/api/v1/users/${updatedUser._id}`).status(200).json({
            self: `/api/v1/users/${updatedUser._id}`,
            userId: updatedUser.userId,
            username: updatedUser.username,
            email: updatedUser.email,
            name: updatedUser.name,
            surname: updatedUser.surname,
            usertype: updatedUser.usertype,
            phone: updatedUser.phone,
            favorite: updatedUser.favorite,
            followed: updatedUser.followed,
            n_followed: updatedUser.n_followed,
            followers: updatedUser.followers,
            n_followers: updatedUser.n_followers,
            blocklist: updatedUser.blocklist,
            n_exchanges: updatedUser.n_exchanges
        });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        await user.remove();
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    } 
});

module.exports = router;
