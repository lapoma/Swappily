require('dotenv').config(); 
const mongoose = require('mongoose'); // Libreria per MongoDB
const app = require('./app/app.js');


const port = process.env.PORT;
if (!port) {
  throw new Error('PORT is not defined in environment variables!');
}

app.locals.db = mongoose.connect( process.env.DB_URL )
.then ( () => {
    
    console.log("Connected to Database");
    
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
    
});

