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
            type: String,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
        cart: [{
          book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
          quantity: { type: Number, default: 1 }
        }],
        role: {
          type: String,
        },
        third_party_auth: [ThirdPartyProviderSchema],
    },
    { strict: false }
);

const User = mongoose.model("users", UserSchema);
module.exports = User;