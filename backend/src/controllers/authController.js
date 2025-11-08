// controllers/authController.js

const AuthService = require("../services/authService");
const authService = new AuthService();

class AuthController {
    async register(req, res) {
        try {
            const response = await authService.register(req.body);
            return res.status(201).json(response);
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const response = await authService.login(email, password);
            return res.json(response);
        } catch (err) {
            return res.status(401).json({ error: err.message });
        }
    }

    async profile(req, res) {
        try {
            const user = await authService.getProfile(req.user.id);
            return res.json(user);
        } catch (err) {
            return res.status(500).json({ error: "No se pudo obtener el perfil." });
        }
    }
}

module.exports = new AuthController();
