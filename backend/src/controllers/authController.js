// 💡 CORRECCIÓN: Importamos directamente la instancia del servicio
const authService = require("../services/authService");

class AuthController {
    async register(req, res) {
        try {
            // Tu log en index.js nos mostró que req.body llega bien.
            // Esta línea ahora funcionará.
            const response = await authService.register(req.body);
            return res.status(201).json(response);
        } catch (err) {
            // Si el error es "El correo ya está en uso", se mostrará aquí.
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