// services/authService.js
// Servicio encargado de autenticación y gestión de credenciales

const jwt = require("jsonwebtoken");
// 1. Importamos el REPOSITORIO (objeto) y el MODELO (clase Mongoose)
const userRepository = require("../repositories/userRepo");
const User = require('../models/User'); // <-- CAMBIO: Añadido

class AuthService {
    constructor() {
        // 2. Asignamos el objeto repositorio, no creamos una instancia
        this.userRepository = userRepository; // <-- CAMBIO: Quitado 'new'
    }

    async register({ name, lastname, email, password }) {
        const existing = await this.userRepository.findUserByEmail(email); // <-- CAMBIO: 'findByEmail' en lugar de 'find'
        if (existing) {
            throw new Error("El correo ya está registrado.");
        }

        // 3. Creamos la INSTANCIA de Mongoose aquí
        const newUserInstance = new User({
            name,
            lastname,
            email,
            password
            // El hook 'pre-save' de tu modelo 'User.js' se encargará de hashear la contraseña
        });

        // 4. Pasamos la INSTANCIA al repositorio (que llamará a .save())
        const user = await this.userRepository.createUser(newUserInstance);

        return {
            message: "Usuario registrado exitosamente",
            user: { // Devolvemos un objeto limpio
                id: user._id,
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                role: user.role
            }
        };
    }

    async login(email, password) {
        const user = await this.userRepository.findUserByEmail(email); // <-- CAMBIO: 'findByEmail'
        if (!user) throw new Error("Credenciales inválidas.");

        // Asumimos que tu modelo User.js tiene el método comparePassword
        const isMatch = await user.comparePassword(password);
        if (!isMatch) throw new Error("Credenciales inválidas.");

        const token = this.generateToken(user);

        return {
            message: "Login exitoso",
            token,
            user: {
                id: user._id,
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                role: user.role
            }
        };
    }

    generateToken(user) {
        const payload = {
            id: user._id,
            role: user.role
        };

        return jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });
    }

    async getProfile(userId) {
        // Asumimos que tu repositorio tiene 'findById'
        return this.userRepository.findById(userId);
    }
}

module.exports = AuthService;