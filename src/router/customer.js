const express = require('express');
const app = express();
const hbs = require('hbs');
const router = express.Router();

const admin = require("../models/admin");
const book = require("../models/book");
const customer = require("../models/customer");
const rentedBook = require("../models/rented_Book")

const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
app.use(cookieParser);


const authrization = require("../middleWare/auhorizationCustomer");

const cookie = require('cookie');

router.get('/customerReg', (req, res) => {
    res.render('customerReg');
});
router.get('/customerLog', (req, res) => {
    res.render('customerLog');
});
router.get("/customerbooklist", async (req, res) => {
    const bookList = await book.find();
    res.render('bookListCustomer', { booklist: bookList });
});
router.get("/customerlogout", authrization, async (req, res) => {
    console.log("reached to filter");
    req.user.tokens = req.user.tokens.filter((element) => {
        return element.token !== req.token
    });
    res.clearCookie('jwt', { expires: new Date(0) });
    res.redirect('/')
});
router.get("/customerreturnbook",authrization, async(req,res)=>{
    const rentedBookDetials = await rentedBook.find();
    console.log("see there are detais of rented book",rentedBookDetials);
    res.render('rentedBookCustomer',{rentedBookDetials: rentedBookDetials});
})

router.post("/customerReturnBook",async(req,res)=>{
    const returnBookId = req.body.itemId;
    const deletedBook = await rentedBook.deleteOne({_id: returnBookId});
    const rentedBookDetials = await rentedBook.find();
    res.render('rentedBookCustomer',{rentedBookDetials:rentedBookDetials})
});

router.post("/customerBuyBook", async (req, res) => {
    const id = req.body.itemId;
    const bookDetail = await book.findOne({ _id: id });
    console.log("given id is ", bookDetail);
    res.render("buyBookConfirmation", { bookDetail: bookDetail })
})
router.post("/confirmBook", async (req, res) => {
    const id = req.body.itemId;
    console.log("look at given book id", id);
    const bookDetail = await book.findOne({_id:id});
    console.log("some book details ", bookDetail.amount   , bookDetail.bookName);

    const kookie = await cookie.parse(req.headers.cookie || "");
    console.log("check the kookie is ",kookie);
    if (kookie.jwt) {
        const token = kookie.jwt;
        console.log("see token ", token);
        const verifyUser = await jwt.verify(token, "iamumarbashirthisismytoken");
        var userDetails = await customer.findOne({ _id: verifyUser._id });
        console.log("see the user ", userDetails);
        try {

            const regrentedBook = new rentedBook({
                bookName: bookDetail.bookName,
                authorName: bookDetail.authorName,
                bookNo: bookDetail.bookNo,
                paidamount : bookDetail.amount,
                customerId: userDetails._id

            })
            await regrentedBook.save();
            res.render('customerDashboard');
        } catch (error) {
            res.send(error);
        }
    }
    else {
        res.redirect('/');
        
    }


});



router.post('/customerLog', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        console.log("email is ", email);
        const verifyUser = await customer.findOne({ email });
        if (password === verifyUser.password) {
            const token = await verifyUser.generateToken();
            res.cookie("jwt", token, {
                http: true,
            })
            if (authrization) {
                res.render('customerDashboard');
            }
        }
        else {
            res.send('password is inValid')
        }
    } catch (error) {
        res.send('email is invalid')
    }
});
router.post('/customerReg', async (req, res) => {
    console.log("data we get are", req.body);
    try {
        if (req.body.password === req.body.cpassword) {
            const customerReg = new customer({
                name: req.body.name,
                Address: req.body.address,
                number: req.body.number,
                password: req.body.password,
                email: req.body.email

            });
            await customerReg.save();
            const token = await customerReg.generateToken();
            console.log("reached back");
            res.cookie("jwt", token, {
                http: true
            });
            console.log("all done");
            res.redirect('customerLog')
        } else {
            res.send('Match Your Password First')
        }

    } catch (error) {
        res.status(400).send(error)
    }

})

module.exports = router;

