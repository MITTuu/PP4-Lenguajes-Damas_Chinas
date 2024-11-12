import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';

import router from './router';

const app = express();

app.use(cors({
    credentials: true,
}));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

// URL de conexión a MongoDB Atlas
const MONGO_URL = 'mongodb+srv://mittuu:BxTmQw8MZ7HT94YG@cluster0.frjhv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Función asincrónica para conectar a MongoDB
const connectToMongo = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log('Conectado a MongoDB exitosamente');
    } catch (error) {
        console.error('Error de conexión a MongoDB:', error);
        process.exit(1); // Salir del proceso si falla la conexión
    }
};

// Llamar a la función de conexión y arrancar el servidor
connectToMongo().then(() => {
    server.listen(8080, () => {
        console.log('server running on http://localhost:8080');
    });
});

app.use('/', router());
