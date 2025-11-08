// repositories/userRepository.js
const { UserModel } = require("../models/User");

class UserRepository {
    async createUser(data) {
        const user = new UserModel(data);
        return user.save();
    }

    async findByEmail(email) {
        return UserModel.findOne({ email });
    }

    async findById(id) {
        return UserModel.findById(id).select("-password");
    }

    async updateUser(id, data) {
        return UserModel.findByIdAndUpdate(id, data, { new: true }).select("-password");
    }

    async changePassword(id, newPassword) {
        const user = await UserModel.findById(id);
        user.password = newPassword;
        return user.save();
    }
}

module.exports = UserRepository;
