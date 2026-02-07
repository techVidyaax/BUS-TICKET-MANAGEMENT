const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 3000;

// =====================
// Middleware
// =====================
app.use(bodyParser.urlencoded({ extended: true }));

// =====================
// MongoDB Connection
// =====================
mongoose.connect("mongodb://127.0.0.1:27017/bus_ticket", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected : bus_ticket"))
.catch(err => console.error(err));

// =====================
// User Schema & Model
// =====================
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const User = mongoose.model("User", userSchema);

// =====================
// Booking Schema & Model
// =====================
const bookingSchema = new mongoose.Schema({
    name: String,
    age: Number,
    gender: String,
    berthPreference: String,
    departingTime: String,
    departingPlace: String,
    arrivalPlace: String,
    date: String,
    numMembers: Number
});

const Booking = mongoose.model("Booking", bookingSchema);

// =====================
// ROUTES
// =====================

// Landing page (first page)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/landing.html"));
});

// Serve static files (HTML, CSS)
app.use(express.static(path.join(__dirname, "../public")));

// ---------------------
// Signup
// ---------------------
app.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.send("User already exists");
    }

    const newUser = new User({ username, password });
    await newUser.save();

    res.redirect("/login.html");
});

// ---------------------
// Login
// ---------------------
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const validUser = await User.findOne({ username, password });
    if (!validUser) {
        return res.send("Invalid credentials");
    }

    res.redirect("/index.html");
});

// ---------------------
// Book Ticket
// ---------------------
app.post("/book-ticket", async (req, res) => {
    try {
        const booking = new Booking({
            name: req.body.name,
            age: req.body.age,
            gender: req.body.gender,
            berthPreference: req.body.berthPreference,
            departingTime: req.body.departingTime,
            departingPlace: req.body.departingPlace,
            arrivalPlace: req.body.arrivalPlace,
            date: req.body.date,
            numMembers: req.body.numMembers
        });

        await booking.save();

        res.redirect("/success.html");
    } catch (error) {
        console.error(error);
        res.status(500).send("Booking failed");
    }
});

// =====================
// Start Server
// =====================
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
