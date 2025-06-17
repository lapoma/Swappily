const express = require('express');
const router = express.Router();
const User = require('../models/user');       // Modello mongoose corretto
const jwt = require('jsonwebtoken');         // Per creare i token
const bcrypt = require('bcrypt');            // Per confrontare password criptate

// ---------------------------------------------------------
// Rotta per autenticare e generare un nuovo token
// ---------------------------------------------------------
router.post('', async function (req, res) {
    // 1. Controllo input
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({
            success: false,
            message: 'Autenticazione fallita: username e password obbligatori.'
        });
    }

    let user;

    // 2. Trova l'utente nel database tramite username
    try {
        user = await User.findOne({ username: req.body.username }).exec();
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Errore del server durante la ricerca dell\'utente.'
        });
    }

    // 3. Utente non trovato
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'Autenticazione fallita: utente non trovato.'
        });
    }

    // 4. Verifica della password con bcrypt
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
        return res.status(401).json({
            success: false,
            message: 'Autenticazione fallita: credenziali non valide.'
        });
    }

    // 5. Tutto ok → crea token
    const payload = {
        id: user._id,
        username: user.username
    };

    const options = {
        expiresIn: 86400 // 24 ore
    };

    const token = jwt.sign(payload, process.env.SUPER_SECRET, options);

    // 6. Risposta al client
    res.json({
        success: true,
        message: 'Ecco il tuo token!',
        token: token,
        id: user._id,
        username: user.username,
        self: "api/v1/" + user._id
    });
});

module.exports = router;
