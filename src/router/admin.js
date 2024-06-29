const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }))

const router = express.Router();

const admin = require("../models/admin");
const book = require("../models/book");

const dialog = require('dialog')

const authrization = require("../middleWare/auhorization")






router.get("/", (req, res) => {
    dialog.info('welcome Bro','message');
    res.render('home')
});
router.get("/adminLogin", (req, res) => {
    res.render('adminLog')
});
router.get("/adminReg", (req, res) => {
    res.render('adminReg')
});
router.get("/addbook", (req, res) => {
    res.render('Adminaddbook')
});
router.get("/logout", authrization, async (req, res) => {
    console.log("reached to filter");
    // req.user.tokens = req.user.tokens.filter((element) => {
    //     return element.token !== req.token
    // })
    req.user.tokens = [];
    res.clearCookie('jwt')
    res.redirect('/')
});



router.post("/adminReg", async (req, res) => {
    try {
        if (req.body.password == req.body.cpassword) {
            const regAdmin = new admin({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })
            const token = await regAdmin.generateToken();
            console.log("token is ",token);
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 900),
                http: true
            })
            const Admin = await regAdmin.save();
            res.render('home')
        } else {
            res.send("password not matched")
        }
    } catch (error) {
        res.status(400).send(error)
    }
});
router.post("/adminLogin", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await admin.findOne({ email });
        if (user.password === password) {
            const token = await user.generateToken();
            res.cookie("jwt", token, {
                http: true
            })
            res.render('adminDashbord');
        } else {
            res.send('Still incorrect Password')
        }
    } catch (error) {
        res.status(400).send("Invalid  Email");
    }
});
router.post("/addbook", async (req, res) => {
    try {
        console.log('going to add addBook', req.body);
        const addBook = new book({
            bookName: req.body.book_name,
            Description: req.body.book_desc,
            time: req.body.time,
            authorName: req.body.author,
            bookNo: req.body.book_no,
            amount: req.body.amount
        })
        const saveBook = await addBook.save();
        res.render('Adminaddbook');
    } catch (error) {
        res.send(error);
    }

});
router.get("/booklist", async (req, res) => {
    const bookList = await book.find();
    res.render('bookList',{booklist : bookList});
    console.log("book list", bookList);
})


module.exports = router;