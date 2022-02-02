const mongoose = require('mongoose');

const ThirdPartyProviderSchema = new mongoose.Schema({
    provider_name: {
        type: String,
        default: null
    },
    provider_id: {
        type: String,
        default: null
    },
    provider_data: {
        type: {},
        default: null
    }
});

// Create Schema
const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String
        },
        role: {
          type: String,
          enum: ['user', 'admin'],
          required: true
        },
        third_party_auth: [ThirdPartyProviderSchema],
    },
    { strict: false }
);

const User = mongoose.model("users", UserSchema);
module.exports = User;