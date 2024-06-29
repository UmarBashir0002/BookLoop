const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const cookieParser = require('cookie-parser');
const adminModel = require("../models/admin");

app.use(cookieParser)


const authrization = async (req, res, next) => {
  try {
    console.log("authorization start and cookie is",req.headers.cookie);
    const kookie = await cookie.parse(req.headers.cookie || "");
    const token = kookie.jwt;
    console.log("see token",token);

    const verifyUser = await jwt.verify(token, "iamumarbashirthisismytoken");
    const userDetails = await adminModel.findOne({ _id: verifyUser._id });
    req.user = userDetails;
    req.token = token;
    next();
  } catch (error) {
    res.send('you are unauthorized for this page')
  }
}

module.exports = authrization;