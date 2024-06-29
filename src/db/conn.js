const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/BookLy",{useFindAndModify:true ,useUnifiedTopology: true, useNewUrlParser: true , useCreateIndex:true}).then(()=>{
    console.log("DB is Connected");
}).catch((e)=>{
console.log("connection failed with",e);
})