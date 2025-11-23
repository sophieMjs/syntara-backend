const UserRepository = require("../repositories/userRepo");

const userRepository = new UserRepository();

class UserController {
    async update(req, res) {
        try {
            const updated = await userRepository.updateUser(req.user.id, req.body);
            res.json(updated);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async changePassword(req, res) {
        try {
            const { newPassword } = req.body;
            await userRepository.changePassword(req.user.id, newPassword);
            res.json({ message: "Contraseña actualizada." });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}

module.exports = new UserController();
