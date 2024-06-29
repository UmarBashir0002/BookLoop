const mongoose = require('mongoose');
const validator = require('validator');

const jwt = require('jsonwebtoken');

const schema = mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        validate: function (value) {
            if (!validator.isEmail) {
                throw new Error("please correct email")
            }
        },
        unique: true
    },
    password: {
        type: String,
        min: 6
    },
    tokens: [{
        token: {
            type: String,
            required: true
        },
    }
    ]
})

schema.methods.generateToken = async function () {
    console.log("reached in generateToken");
    const token = await jwt.sign({ _id: this.id.toString() }, "iamumarbashirthisismytoken");
    this.tokens = this.tokens.concat({ token });
    await this.save();
    console.log("hey look at the token", token);
    return token;
}
const admin = new mongoose.model("admin", schema);
module.exports = admin;
