import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";

import { spawn } from 'child_process';
const announcer = spawn('node', ['src/network/announcer/discovery-announcer.js', '--name', 'backend', '--port', '3000', '--secret', 'syntara'], { stdio: 'inherit' });
// opcional: manejos de exit/errores...

dotenv.config();

async function connectDB() {
    try {
        // Obtener IP del servidor Mongo dinámicamente
        const response = await axios.get("http://10.195.48.125.25:4000/ip");
        const mongoIP = response.data.ip;
        const encodedPass = encodeURIComponent(process.env.MONGO_PASS);

        const uri = `mongodb://${process.env.MONGO_USER}:${encodedPass}@${mongoIP}:27017/${process.env.MONGO_DB}?authSource=admin`;

        console.log("🌐 Conectando a:", uri);

        await mongoose.connect(uri);
        console.log("" + "Conectado exitosamente a MongoDB remoto");
    } catch (err) {
        console.error("Error de conexión a MongoDB:", err);
    }
}

connectDB();
