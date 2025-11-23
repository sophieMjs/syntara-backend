const { SubscriptionModel } = require("../models/Subscription");
const { UserModel } = require("../models/User");

class SubscriptionRepository {
    async createSubscription(data) {
        return SubscriptionModel.create(data);
    }


    async getUserSubscription(userId) {
        const user = await UserModel.findById(userId).populate("subscription");
        return user?.subscription || null;
    }

    async updateSubscription(id, data) {
        return SubscriptionModel.findByIdAndUpdate(id, data, { new: true });
    }

    async attachSubscriptionToUser(userId, subscriptionId) {
        return UserModel.findByIdAndUpdate(
            userId,
            { subscription: subscriptionId },
            { new: true }
        ).populate("subscription");
    }

}

module.exports = SubscriptionRepository;
