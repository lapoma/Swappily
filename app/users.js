const express = require('express');
const router = express.Router();
const User = require('./models/user');

// Email check
//https://stackoverflow.com/questions/63118717/how-do-i-validate-a-password-using-regular-expressions
function checkPassword(inputtxt) {
    var decimal = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,50}$/;
    return decimal.test(inputtxt);
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

router.post('', async (req, res) => {
  const { username, email, name, surname, password } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: '"Name" must be a non-empty string' });
  }

  if (!surname || typeof surname !== 'string') {
    return res.status(400).json({ error: '"Surname" must be a non-empty string' });
  }

  if (!email || !checkIfEmailInString(email)) {
    return res.status(400).json({ error: 'The field "email" must be a valid email' });
  }

  const isUsernameValid = await checkUsername(username);
  if (!isUsernameValid) {
    return res.status(400).json({ error: 'The field "username" must be a non-empty string, 3-20 chars, and unique' });
  }

  if (!password || !checkPassword(password)) {
    return res.status(400).json({ error: 'Password must be 8+ chars with uppercase, lowercase, number, special char' });
  }

  const user = new User({ username, email, name, surname, password });

  try {
    const savedUser = await user.save();
    res.location('/api/v1/users/' + savedUser._id);
    res.status(201).json({
      self: '/api/v1/users/' + savedUser._id,
      id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      name: savedUser.name,
      surname: savedUser.surname
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('', async (req, res) => {
  try {
    let users;
    if (req.query.username) {
      users = await User.find({ username: req.query.username });
      if (users.length === 0) {
        return res.status(404).json({ error: 'No users found with that username' });
      }
    } else {
      users = await User.find({});
    }

    users = users.map(user => ({
      self: '/api/v1/users/' + user._id,
      id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      surname: user.surname
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
      id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      surname: user.surname
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    ['username', 'email', 'name', 'surname'].forEach(field => {
      if (req.body[field]) user[field] = req.body[field];
    });

    await user.save();
    res.status(200).json({
      self: '/api/v1/users/' + user._id,
      id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      surname: user.surname
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
