const SubscriptionService = require("../services/subscriptionService");
const subscriptionService = new SubscriptionService();

class SubscriptionController {
    async assign(req, res) {
        try {
            const { plan } = req.body;
            const response = await subscriptionService.assignPlanToUser(
                req.user.id,
                plan
            );
            res.json(response);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async upgrade(req, res) {
        try {
            const { newPlan } = req.body;
            const updated = await subscriptionService.upgradePlan(
                req.user.id,
                newPlan
            );
            res.json(updated);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async getMyPlan(req, res) {
        try {
            const plan = await subscriptionService.getUserSubscription(req.user.id);
            res.json(plan);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}

module.exports = new SubscriptionController();
