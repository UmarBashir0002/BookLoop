const express = require('express');
const app = express();
const hbs = require("hbs");

app.use(express.urlencoded({extended:false}))

const path = require('path');

const adminRouter = require('./router/admin');
const customerRouter = require('./router/customer')

app.use(adminRouter);
app.use(customerRouter);



const partialsPath = path.join(__dirname, "/templates/partials");
hbs.registerPartials(partialsPath);

const viewsPath = path.join(__dirname,"/templates/views");
app.set("view engine","hbs");
app.set("views", viewsPath);

require("./db/conn");

const port = process.env.PORT || 2000;

app.listen(port,()=>{
    console.log(`listening at port ${port}`);
})
