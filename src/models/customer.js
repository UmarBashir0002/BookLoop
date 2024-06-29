const express = require('express');
const app = express();
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose');

const schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    Address: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    tokens: [{
        token: {}
    }]
});


schema.methods.generateToken = async function () {
    console.log("reached in generateToken with id",this.id.toString());
    const token = await jwt.sign({ _id : this.id.toString() }, "iamumarbashirthisismytoken");
    this.tokens = this.tokens.concat({ token });
    await this.save();
    console.log("hey look at the token", token);
    return token;
}
const customer = new mongoose.model("customer", schema);
module.exports = customer;

