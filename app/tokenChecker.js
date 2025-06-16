const jwt = require('jsonwebtoken');

const tokenChecker = function(req, res, next) {
    // Cerca il token nei parametri di query, nel body o nell'header
    const token = req.query.token || req.body.token || req.headers['x-access-token'];

    // Se il token non è presente
    if (!token) {
        return res.status(401).send({ 
            success: false,
            message: 'No token provided.'
        });
    }

    // Verifica il token con la chiave segreta e controlla la scadenza
    jwt.verify(token, process.env.SUPER_SECRET, function(err, decoded) {
        if (err) {
            return res.status(403).send({
                success: false,
                message: 'Failed to authenticate token.'
            });
        } else {
            // Se è tutto ok, aggiunge l'utente decodificato alla richiesta
            req.loggedUser = decoded;
            next();
        }
    });
};

module.exports = tokenChecker;
