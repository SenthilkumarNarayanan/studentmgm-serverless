const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email']
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "admin"   // auto set
    }
}, {
    timestamps: true
});

// Hash password
adminSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
adminSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const AdminModel = mongoose.model("Admin", adminSchema);

module.exports = AdminModel;