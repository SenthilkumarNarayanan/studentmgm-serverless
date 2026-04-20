const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    regNo: {
        type: String,
        required: [true, 'Registration number is required'],
        unique: true
    },
    password: {
        type: String,
        select: false,
        required: false  // CHANGE: Make password NOT required for enrollment
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    profile: {
        phone: { type: String, default: '' },
        address: { type: String, default: '' }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving - only if password exists
studentSchema.pre('save', async function() {
    if (!this.isModified('password') || !this.password) {
        return;
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
       return console.error(err);
       ;
    }
});
// Compare password method
studentSchema.methods.comparePassword = async function(candidatePassword) {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password when converting to JSON
studentSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Student', studentSchema);