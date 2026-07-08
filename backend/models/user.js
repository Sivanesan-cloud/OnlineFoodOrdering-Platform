import mongoose from 'mongoose';

import validator from 'validator';

import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken';

import crypto from 'crypto';


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        maxLength: [30, 'Name cannot exceed 30 characters'],
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, "Enter password"],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, "Confirm password"],
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: "Passwords are not the same"
        }
    },
    phoneNumber: {
        type: String,
        required: true,
        match: [/^[0-9]{10}$/, "Enter valid phone number"]
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    avatar: {
        public_id: String,
        url: String
    },
    passwordChangedAt:Date,
    passwordResetToken: String,
    passwordResetExpires: Date
},
    {
        timestamps: true
    }
);

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}
//check's wheather the user password was changed after getting the jwt token
//if yes, the old token is invalid and user must login again
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000, 10
        )
        return JWTTimestamp < changedTimestamp;
    }
    return false;
}
//custom method to generate jwt token
userSchema.methods.getJWTToken = function() {
    return jwt.sign({ id: this._id }, 
        process.env.JWT_SECRET,
         { expiresIn: process.env.JWT_EXPIRES}
        )
}

// Compile the model and export it as the default module
const User = mongoose.model('User', userSchema);
export default User;