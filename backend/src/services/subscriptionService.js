const SubscriptionRepository = require("../repositories/subscriptionRepo");
const UserRepository = require("../repositories/userRepo");
const SearchRepository = require("../repositories/searchRepo");

class SubscriptionService {
    constructor() {
        this.subRepo = new SubscriptionRepository();
        this.userRepo = new UserRepository();
        this.searchRepo = SearchRepository;

        this.plans = {

            Pro: {
                price: 18800,
                maxSearchesPerMonth: 2000,
                features: ["10 tiendas", "reportes", "favoritos"],
            },
            Enterprise: {
                price: 0,
                maxSearchesPerMonth: 5000,
                features: [
                    "reportes avanzados",
                    "API Key",
                    "inteligencia de mercado",
                    "todas las tiendas",
                ],
            },
        };
    }

    async assignPlanToUser(userId, planName) {
        if (!this.plans[planName]) {
            throw new Error("El plan no existe.");
        }

        const subscription = await this.subRepo.createSubscription({
            type: planName,
            price: this.plans[planName].price,
            features: this.plans[planName].features,
            maxSearchesPerMonth: this.plans[planName].maxSearchesPerMonth
        });

        const updatedUser = await this.subRepo.attachSubscriptionToUser(
            userId,
            subscription._id
        );

        return {
            message: "Suscripción asignada exitosamente",
            user: updatedUser,
        };
    }

    async upgradePlan(userId, newPlan) {
        const plan = this.plans[newPlan];
        if (!plan) throw new Error("Ese plan no existe.");

        const current = await this.getUserSubscription(userId);

        if (!current) {
            return this.assignPlanToUser(userId, newPlan);
        }

        if (current.type === newPlan) {
            throw new Error("El usuario ya tiene este plan.");
        }

        const updated = await this.subRepo.updateSubscription(current._id, {
            type: newPlan,
            price: plan.price,
            features: plan.features,
            maxSearchesPerMonth: plan.maxSearchesPerMonth
        });

        return { message: "Plan actualizado correctamente", subscription: updated };
    }

    async getUserSubscription(userId) {
        return this.subRepo.getUserSubscription(userId);
    }

    async checkMonthlyLimit(userId) {
        const subscription = await this.getUserSubscription(userId);

        if (!subscription) {
            const searches = await this.searchRepo.countSearchesToday(userId);
            const FREE_LIMIT = 3;

            return {
                plan: "FREE",
                remaining: Math.max(0, FREE_LIMIT - searches),
                allowed: searches < FREE_LIMIT
            };
        }

        const searches = await this.searchRepo.countSearchesThisMonth(userId);

        return {
            plan: subscription.type,
            remaining: Math.max(0, subscription.maxSearchesPerMonth - searches),
            allowed: searches < subscription.maxSearchesPerMonth
        };
    }
}

module.exports = SubscriptionService;