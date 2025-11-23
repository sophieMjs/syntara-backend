const jwt = require("jsonwebtoken");

module.exports = {
    optional: (req, res, next) => {
        const header = req.headers.authorization;

        if (!header) {
            req.user = null;
            return next();
        }

        const token = header.split(" ")[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = { id: decoded.id };
        } catch (error) {
            req.user = null;
        }

        next();
    },

    required: (req, res, next) => {
        const header = req.headers.authorization;

        if (!header) {
            return res.status(401).json({
                success: false,
                message: "Token requerido"
            });
        }

        const token = header.split(" ")[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = { id: decoded.id };
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Token inválido o expirado"
            });
        }
    }
};
