import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    userName: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false,
        unique: true
    },
    password: {
        type: String,
        required: false
    },
    created: {
        type: Date,
        required: false,
        default: Date.now
    },
    role: {
        type: String,
        required: false
    }
})

export default UserSchema;