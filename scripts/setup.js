require('dotenv').config(); // Carica le variabili d'ambiente (.env)
const mongoose = require('mongoose'); // Libreria per MongoDB
const bcrypt = require('bcrypt'); // Libreria per criptare password
const User = require('../app/models/user'); // Modello Mongoose utente

// Connessione al database
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connessione al database riuscita.");
    return User.deleteMany({}); // Elimina tutti gli utenti esistenti
  })
  .then(async () => {
    // Cripta le password
    const marioPassword = await bcrypt.hash('mario.rossi2004', 10);
    const benedettaPassword = await bcrypt.hash('benedetta.bicego2004', 10);

    // Crea oggetti utente
    const mario = new User({
      username: 'mario.rossi',
      password: marioPassword
    });

    const benedetta = new User({
      username: 'benedetta.bicego',
      password: benedettaPassword
    });

    // Salva entrambi gli utenti
    await mario.save();
    console.log('Utente mario.rossi salvato con successo');

    await benedetta.save();
    console.log('Utente benedetta.bicego salvato con successo');

    process.exit(); // Termina lo script con successo
  })
  .catch((err) => {
    console.error('Errore durante il setup:', err);
    process.exit(1); // Termina con errore
  });

