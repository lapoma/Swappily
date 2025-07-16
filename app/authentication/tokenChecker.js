const jwt = require('jsonwebtoken');

function tokenChecker(req, res, next) {
  const token = req.headers['token'] || req.query.token;
  console.log('[tokenChecker] token:', token);

  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  jwt.verify(token, process.env.SUPER_SECRET, (err, decoded) => {
    if (err) {
        return res.status(403).json({
            success: false,
            message: 'Failed to authenticate token.'
        });
    }
    req.loggedUser = decoded;
    next();
  });
};

module.exports = tokenChecker;