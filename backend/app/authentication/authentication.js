const express = require('express');
const router = express.Router();
const User = require('../models/user');       
const jwt = require('jsonwebtoken');         
const bcrypt = require('bcrypt');            


router.post('', async function (req, res) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({
            success: false,
            message: 'Autenticazione fallita: username e password obbligatori.'
        });
    }

    let user;

    try {
        user = await User.findOne({ username: req.body.username }).exec();
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Errore del server durante la ricerca dell\'utente.'
        });
    }

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'Autenticazione fallita: utente non trovato.'
        });
    }

    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
        return res.status(401).json({
            success: false,
            message: 'Autenticazione fallita: credenziali non valide.'
        });
    }

    if (!(await bcrypt.compare(req.body.password, user.password))) {
        return res.status(401).json({ success: false, message: 'Authentication failed: Invalid credentials' });
    }

    var payload = {
        id: user._id,
        username: user.username,
        uertype: user.usertype
    };

    var options = {
        expiresIn: 86400 
    };

    const token = jwt.sign(payload, process.env.SUPER_SECRET, options);

    res.json({
        success: true,
        message: 'Ecco il tuo token!',
        token: token,
        id: user._id,
        username: user.username,
        usertype: user.usertype,
        self: "api/v1/" + user._id
    });
});

module.exports = router;
