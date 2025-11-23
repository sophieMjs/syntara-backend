const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

class UserEntity {
    constructor({ name, lastname, email, password, role = 'user', createdAt = new Date() } = {}) {
        this.name = name;
        this.lastname = lastname; // <-- AÑADIDO
        this.email = email;
        this.password = password;
        this.role = role;
        this.createdAt = createdAt;
    }

}

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true }, // <-- AÑADIDO
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', default: null },
    createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (plain) {
    return bcrypt.compare(plain, this.password);
};

const UserModel = mongoose.model('User', userSchema);

module.exports = { UserEntity, UserModel };