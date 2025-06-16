const express = require('express');
const router = express.Router();
const User = require('./models/user'); // modello mongoose corretto
const jwt = require('jsonwebtoken');   // per creare i token
const bcrypt = require('bcrypt');      // per confrontare password criptate

// ---------------------------------------------------------
// Rotta per autenticare e generare un nuovo token
// ---------------------------------------------------------
router.post('', async function (req, res) {
    // 1. Controllo input
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            success: false,
            message: 'Autenticazione fallita: email e password obbligatorie.'
        });
    }

    let user;

    // 2. Trova l'utente nel database
    try {
        user = await User.findOne({ email: req.body.email }).exec();
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
        email: user.email,
        id: user._id
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
        email: user.email,
        id: user._id,
        self: "api/v1/" + user._id
    });
});

module.exports = router;
