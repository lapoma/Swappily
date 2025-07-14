const express = require('express');
const router = express.Router();
const User = require('./models/user');
const bcrypt = require('bcrypt');
const tokenChecker = require('./authentication/tokenChecker.js');
const Listing = require('./models/listing');

// Password check
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

// Email check
function checkIfEmailInString(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// GET /me
router.get('/me', tokenChecker, async (req, res) => {
    try {
      const user = await User.findById(req.loggedUser.id);
      if (!user) return res.status(404).json({ error: 'User not found' });

      return res.status(200).json({
        username: user.username,
        description: user.description,
        profile_url: user.profile_url
      });
    } catch (err) {
      console.error('[GET /me] error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET utenti (all or by username)
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
        n_exchanges: user.n_exchanges,
        description: user.description,
        profile_url: user.profile_url
    }));

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET user by ID
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
        n_exchanges: user.n_exchanges,
        description: user.description,
        profile_url: user.profile_url
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST new user
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
        n_exchanges,
        description,
        profile_url
    } = req.body;

    
    if (!name || typeof name !== 'string')
        return res.status(400).json({ error: '"Name" must be a non-empty string' });
    
    if (!surname || typeof surname !== 'string')
        return res.status(400).json({ error: '"Surname" must be a non-empty string' });
    
    if (!email || !checkIfEmailInString(email))
        return res.status(400).json({ error: '"email" must be a valid email' });

    const existingEmail = await User.findOne({ email });
    if (existingEmail)
        return res.status(400).json({ error: 'Email already in use' });
    
    const isUsernameValid = await checkUsername(username);
    if (!isUsernameValid)
        return res.status(400).json({ error: '"username" must be 3-20 chars, and unique' });
    
    if (!password || !checkPassword(password))
        return res.status(400).json({ error: 'Password must be 8+ chars with uppercase, lowercase, number, special char' });
    
    if (!usertype || !['user', 'operator'].includes(usertype))
        return res.status(400).json({ error: '"usertype" must be either "user" or "operator"' });
    
    if (typeof n_followed !== 'number' || typeof n_followers !== 'number' || typeof n_exchanges !== 'number')
        return res.status(400).json({ error: '"n_followed", "n_followers", "n_exchanges" must be numbers' });
  
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
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
            n_exchanges,
            description: description || '',
            profile_url: profile_url || ''
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
            n_exchanges: savedUser.n_exchanges,
            description: savedUser.description,
            profile_url: savedUser.profile_url
        });
    } catch (error) {        
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT update user
router.put('/:id', async (req, res) => {
    try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
  
        const {
            email, username, name, surname, password, usertype, phone,
            favorite, followed, n_followed, followers, n_followers, blocklist, n_exchanges,
            description, profile_url
        } = req.body;

        if (!email || !checkIfEmailInString(email))
            return res.status(400).json({ error: 'The field "email" must be a valid email' });

        const existingEmail = await User.findOne({ email });
        if (existingEmail && existingEmail._id.toString() !== user._id.toString())
            return res.status(400).json({ error: 'Email already in use' });
  
        if (!username || username.length < 3 || username.length > 20)
            return res.status(400).json({ error: 'The field "username" must be 3-20 characters' });
  
        if (!name || typeof name !== 'string')
            return res.status(400).json({ error: '"Name" must be a non-empty string' });
  
        if (!surname || typeof surname !== 'string')
            return res.status(400).json({ error: '"Surname" must be a non-empty string' });
  
        if (password) {
            const isSame = await bcrypt.compare(password, user.password);
            if (isSame)
                return res.status(400).json({ error: 'Password MUST be different from the previous one' });
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
        if (description) user.description = description;
        if (profile_url) user.profile_url = profile_url;
  
        const updatedUser = await user.save();
  
        res.location(`/api/v1/users/${updatedUser._id}`).status(200).json({
            self: `/api/v1/users/${updatedUser._id}`,
            userId: updatedUser._id,
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
            n_exchanges: updatedUser.n_exchanges,
            description: updatedUser.description,
            profile_url: updatedUser.profile_url
        });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Server error' });
    }
});

// DELETE user
router.delete('/:id', tokenChecker, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        await user.remove();
        res.status(200).json(user);
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Server error' });
    } 
});

// Aggiungere ai preferiti
router.post('/:userId/favorites/:listingId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
    
        const listing = await Listing.findById(req.params.listingId);
        if (!listing) return res.status(404).json({ error: 'Listing not found' });
    
        // Controlla se il listing è già nei preferiti
        if (!user.favorite.includes(req.params.listingId)) {
            user.favorite.push(req.params.listingId);
            await user.save();
        }
    
        // Restituisci la lista aggiornata dei preferiti
        res.status(200).json(user.favorite);
    } catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

  //rimuovi dai preferiti
  router.delete('/:userId/favorites/:listingId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
    
        // Filtra l'ID da rimuovere
        user.favorite = user.favorite.filter(
            fav => fav.toString() !== req.params.listingId
        );
        
        await user.save();
        res.status(200).json(user.favorite);
    } catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

  //ottieni preferiti
  router.get('/:userId/favorites', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .populate('favorite', 'title price images');
    
        if (!user) return res.status(404).json({ error: 'User not found' });
    
        res.status(200).json(user.favorite || []);
    } catch (error) {
        console.error('Error getting favorites:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Blocca un utente
router.post('/:userId/block/:blockedUserId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'Utente non trovato' });
    
    if (req.params.userId === req.params.blockedUserId) {
      return res.status(400).json({ error: 'Non puoi bloccare te stesso' });
    }
    
    if (user.blockedUsers.includes(req.params.blockedUserId)) {
      return res.status(400).json({ error: 'Utente già bloccato' });
    }
    
    user.blockedUsers.push(req.params.blockedUserId);
    await user.save();
    
    res.status(200).json({ 
      message: 'Utente bloccato con successo',
      blockedUsers: user.blockedUsers 
    });
  } catch (error) {
    console.error('Errore nel bloccare utente:', error);
    res.status(500).json({ error: 'Errore del server' });
  }
});

// Sblocca un utente
router.delete('/:userId/block/:blockedUserId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'Utente non trovato' });
    
    if (!user.blockedUsers.includes(req.params.blockedUserId)) {
      return res.status(400).json({ error: 'Utente non bloccato' });
    }

    user.blockedUsers = user.blockedUsers.filter(
      id => id.toString() !== req.params.blockedUserId
    );
    
    await user.save();
    res.status(200).json({ 
      message: 'Utente sbloccato con successo',
      blockedUsers: user.blockedUsers 
    });
  } catch (error) {
    console.error('Errore nello sbloccare utente:', error);
    res.status(500).json({ error: 'Errore del server' });
  }
});

// Ottieni la lista degli utenti bloccati
router.get('/:userId/blocked', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('blockedUsers', 'username name surname');
    
    if (!user) return res.status(404).json({ error: 'Utente non trovato' });
    
    res.status(200).json(user.blockedUsers || []);
  } catch (error) {
    console.error('Errore nel recuperare utenti bloccati:', error);
    res.status(500).json({ error: 'Errore del server' });
  }
});

// Segui un utente
router.post('/:userId/follow/:targetUserId', tokenChecker, async (req, res) => {
  try {
      if (req.loggedUser.id !== req.params.userId) {
          return res.status(403).json({ error: 'Non autorizzato a seguire per conto di altri utenti' });
      }

      if (req.params.userId === req.params.targetUserId) {
          return res.status(400).json({ error: 'Non puoi seguire te stesso' });
      }

      const user = await User.findById(req.params.userId);
      const targetUser = await User.findById(req.params.targetUserId);

      if (!user || !targetUser) {
          return res.status(404).json({ error: 'Utente non trovato' });
      }

      if (user.followed.includes(req.params.targetUserId)) {
          return res.status(400).json({ error: 'Stai già seguendo questo utente' });
      }

      if (targetUser.blocklist.includes(req.params.userId)) {
          return res.status(403).json({ error: 'Non puoi seguire questo utente' });
      }

      user.followed.push(req.params.targetUserId);
      user.n_followed = user.followed.length;

      targetUser.followers.push(req.params.userId);
      targetUser.n_followers = targetUser.followers.length;

      await Promise.all([user.save(), targetUser.save()]);

      res.status(200).json({
          message: `Ora segui ${targetUser.username}`,
          n_followed: user.n_followed,
          n_followers: targetUser.n_followers
      });

  } catch (error) {
      console.error('Errore nel seguire utente:', error);
      res.status(500).json({ error: 'Errore del server' });
  }
});

// Smetti di seguire un utente
router.delete('/:userId/follow/:targetUserId', tokenChecker, async (req, res) => {
  try {
    
      if (req.loggedUser.id !== req.params.userId) {
          return res.status(403).json({ error: 'Non autorizzato a smettere di seguire per conto di altri utenti' });
      }

      const user = await User.findById(req.params.userId);
      const targetUser = await User.findById(req.params.targetUserId);

      if (!user || !targetUser) {
          return res.status(404).json({ error: 'Utente non trovato' });
      }

      if (!user.followed.includes(req.params.targetUserId)) {
          return res.status(400).json({ error: 'Non stai seguendo questo utente' });
      }
  
      user.followed = user.followed.filter(id => id.toString() !== req.params.targetUserId);
      user.n_followed = user.followed.length;

      targetUser.followers = targetUser.followers.filter(id => id.toString() !== req.params.userId);
      targetUser.n_followers = targetUser.followers.length;

      await Promise.all([user.save(), targetUser.save()]);

      res.status(200).json({
          message: `Hai smesso di seguire ${targetUser.username}`,
          n_followed: user.n_followed,
          n_followers: targetUser.n_followers
      });

  } catch (error) {
      console.error('Errore nello smettere di seguire utente:', error);
      res.status(500).json({ error: 'Errore del server' });
  }
});

// Ottieni la lista degli utenti seguiti
router.get('/:userId/following', async (req, res) => {
  try {
      const user = await User.findById(req.params.userId)
          .populate('followed', 'username name surname profile_url');

      if (!user) {
          return res.status(404).json({ error: 'Utente non trovato' });
      }

      res.status(200).json({
          following: user.followed,
          count: user.n_followed
      });
  } catch (error) {
      console.error('Errore nel recuperare utenti seguiti:', error);
      res.status(500).json({ error: 'Errore del server' });
  }
});

// Ottieni la lista dei follower
router.get('/:userId/followers', async (req, res) => {
  try {
      const user = await User.findById(req.params.userId)
          .populate('followers', 'username name surname profile_url');

      if (!user) {
          return res.status(404).json({ error: 'Utente non trovato' });
      }

      res.status(200).json({
          followers: user.followers,
          count: user.n_followers
      });
  } catch (error) {
      console.error('Errore nel recuperare follower:', error);
      res.status(500).json({ error: 'Errore del server' });
  }
});

// Verifica se un utente segue un altro utente
router.get('/:userId/isFollowing/:targetUserId', async (req, res) => {
  try {
      const user = await User.findById(req.params.userId);
      
      if (!user) {
          return res.status(404).json({ error: 'Utente non trovato' });
      }

      const isFollowing = user.followed.some(id => id.toString() === req.params.targetUserId);

      res.status(200).json({ isFollowing });
  } catch (error) {
      console.error('Errore nel verificare il follow:', error);
      res.status(500).json({ error: 'Errore del server' });
  }
});
  
module.exports = router;