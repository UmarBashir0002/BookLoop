const db = require("../db/conn");
const mongoose = require('mongoose');

const schema = mongoose.Schema({
    bookName:{
        type : String,
        unique:true
    }, 
    authorName:{
        type : String,
        required: true
    },
    bookNo:{
        type:Number,
        required:true
    },
    paidamount:{
        type:Number,
        required:true
    },
    customerId:{
        type:String,
        required:true
    }
})

const rentedBook = new mongoose.model("rentedBook",schema);
module.exports=rentedBook;