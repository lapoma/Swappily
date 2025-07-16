const jwt = require('jsonwebtoken');

function tokenChecker(req, res, next) {
  // Leggi prima dall'header 'token', poi da query.token
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
    // Attach the decoded user id to the request object
    req.loggedUser = decoded;
    next();
  });
};

module.exports = tokenChecker;