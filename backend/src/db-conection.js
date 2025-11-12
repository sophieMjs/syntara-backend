const mongoose = require('mongoose');
require('dotenv').config();

// Leemos las variables de tu .env
const MONGODB_HOST = process.env.MONGODB_HOST || 'localhost';
const MONGODB_PORT = process.env.MONGODB_PORT || 27017;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'SyntaraFlow';

const MONGODB_URI = `mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DB_NAME}`;

// Usamos Mongoose para conectar, no MongoClient
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log(`✅ Conexión con Mongoose exitosa: ${MONGODB_URI}`);
    })
    .catch((err) => {
        console.error('Error al conectar Mongoose:', err);
        process.exit(1); // Si Mongoose no conecta, cerramos la app
    });

// No exportamos 'getDb', Mongoose maneja la conexión globalmente.
module.exports = mongoose;