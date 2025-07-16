const jwt = require('jsonwebtoken');

const tokenChecker = function(req, res, next) {
    const token = req.query.token || req.body.token || req.headers['x-access-token'];

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }


    if (!token) {
        return res.status(401).send({ 
            success: false,
            message: 'No token provided.'
        });
    }

    jwt.verify(token, process.env.SUPER_SECRET, function(err, decoded) {
        if (err) {
            return res.status(403).send({
                success: false,
                message: 'Failed to authenticate token.'
            });
        } else {
            req.loggedUser = decoded;
            next();
        }
    });
};

module.exports = tokenChecker;
