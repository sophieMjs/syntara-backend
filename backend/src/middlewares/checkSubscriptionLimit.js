// middlewares/checkSubscriptionLimit.js

const SubscriptionService = require("../services/subscriptionService");
const subscriptionService = new SubscriptionService();

module.exports = async (req, res, next) => {
    try {
        const limit = await subscriptionService.checkMonthlyLimit(req.user.id);

        if (!limit.allowed) {
            return res.status(403).json({
                error: "Límite mensual alcanzado",
                plan: limit.plan,
                remaining: limit.remaining
            });
        }

        next();
    } catch (err) {
        res.status(500).json({ error: "Error validando suscripción" });
    }
};