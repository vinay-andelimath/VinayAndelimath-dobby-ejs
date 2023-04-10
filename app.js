require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true });
//extending the simple Schema to object for encryption
const userSchema = ({
    email: String,
    password: String
});

// const secret = "thisistheimagesecretpage";
// userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);

//file part
// const fileSchema = new mongoose.Schema({
//     name: String,
//     data: Buffer
//   });
//   const File = mongoose.model("File", fileSchema);

// Step 4: Save the uploaded file to the database
// app.post("/upload", upload.single("file"), async function (req, res) {
//     const newFile = new File({
//         name: req.file.originalname,
//         data: req.file.buffer
//     });
//     await newFile.save();
//     res.redirect("/secrets");
// });



app.get("/", function (req, res) {
    res.render("home");

});
//----------------------call back hell--------
// app.get("/login", function (req, res) {
//     res.render("login");
// });
//----------asynchronus--------------
app.get("/login", async function (req, res) {
    try {
        res.render("login");
    } catch (err) {
        console.log('Error rendering login page:', err);
        res.render("error", { error: "An error occurred. Please try again later." });
    }
});

//------------------------call back hell-----------------
// app.get("/register", function (req, res) {
//     res.render("register");
// });
//---------------using asynchronous-------------
app.get("/register", async function (req, res) {
    try {
        res.render("register");
    } catch (err) {
        console.log('Error rendering register page:', err);
        res.render("error", { error: "An error occurred. Please try again later." });
    }
});

//---------------callback hell-resolved--------------------
// app.post("/register", function (req, res) {
//     const newUser = new User({
//         email: req.body.email,
//         password: req.body.password
//     })
//     async function saveUser(newUser) {
//         try {
//             await newUser.save();
//             // The save operation was successful
//             res.render("secrets");
//         } catch (err) {
//             // An error occurred during the save operation
//             console.log('Error saving user:', err);
//         }
//     }
//     saveUser(newUser);


// });
//-----------------implemented using aync and await--------
app.post("/register", async function (req, res) {
    const newUser = new User({
        email: req.body.email,
        password: req.body.password
    });
    console.log(newUser);

    try {
        await newUser.save();
        // The save operation was successful
        res.render("secrets");
    } catch (err) {
        // An error occurred during the save operation
        console.log('Error saving user:', err);
    }
});
//--------login -post using aysn and await----------
// app.post("/login", async function (req, res) {
//     const username = req.body.username;
//     const password = req.body.password;
//     try {
//         console.log("foundUser:", username);
//         console.log("password:", password);
//         await User.findOne({ email: username });
//         if (username && username.password === password) {
//             res.render("secrets");
//         }

//     } catch (err) {
//         console.log(err);
//     }


// });
// app.post("/login", async function (req, res) {
//     const username = req.body.username;
//     const password = req.body.password;

//     try {
//         const foundUser = await User.findOne({ email: username });
//         //console.log(foundUser && foundUser.password === password);
//         console.log(foundUser);
//         console.log(foundUser.password);
//         if (foundUser) {
//             if (foundUser.password === password) {
//                 res.render("secrets");
//             }
//         } else {
//             res.render("login", { error: "Invalid username or password" });
//         }
//     } catch (err) {
//         console.log(err);
//         res.render("login", { error: "An error occurred. Please try again later." });
//     }
// });
//---------------------------------------
app.post("/login", async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    // Query the database for a user with the provided email and password
    const user = await User.findOne({ email: email, password: password });

    if (user) {
        // If a user is found, render the secrets page
        res.render("secrets");
    } else {
        // If a user is not found, render an error page or redirect to the login page
        res.redirect("/");
    }
});


//port specified
app.listen(3000, function (req, res) {
    console.log("lisening on port 3000");
})
