const jwt = require('jsonwebtoken');

function tokenChecker(req, res, next) {
    // Cerca il token in query, body o header (header 'x-access-token' o 'authorization')
    const token = req.headers['token'] || req.headers['token'] || req.body.token || req.query.token;

    if (!token) {
        return res.status(401).json({ 
            success: false,
            message: 'No token provided.'
        });
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
