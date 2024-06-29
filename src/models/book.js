const db = require("../db/conn");
const mongoose = require('mongoose');

const schema = mongoose.Schema({
    bookName:{
        type : String,
        unique:true
    },
    Description:{
        type: String,
        required: true,       
    },
    
    authorName:{
        type : String,
        required: true
    },
    bookNo:{
        type:Number,
        required:true
    },
    amount:{
        type:Number,
        required:true
    }
})

const book = new mongoose.model("book",schema);
module.exports=book;