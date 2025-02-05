require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const mongoose = require("mongoose");

const users = require("./models/users.js");
let ejs = require("ejs");
const ejsMate = require("ejs-mate");

const app = express();
app.engine("ejs", ejsMate);
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/public")));

app.set("views", __dirname + "/views");
app.set("view engine", "ejs"); // so you can render('index')

// MongoDB Connection (Replace with your MongoDB URL)
mongoose
  .connect("mongodb://127.0.0.1:27017/tinrec", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("DB connection error:", err));

// User Schema & Model
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
});
const User = mongoose.model("User", UserSchema);

// Register Route
app.get("/register", (req, res) => {
  res.render("signup.ejs");
});

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("All fields required");
      return res.redirect("/register?error=All fields are required"); // Redirect with an error message
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.redirect("/register?error=User already exists"); // Redirect if user exists
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    console.log("User Registered");

    // ✅ Redirect to login page after successful signup
    res.redirect("/login");
  } catch (error) {
    console.error("Error in user registration:", error);
    res.redirect("/register?error=Server error, try again");
  }
});

// Login Route
app.get("/login", (req, res) => {
  res.render("login.ejs");
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, "your_secret_key", {
      expiresIn: "1h",
    });

    // Redirect to home page after successful login
    res.cookie("token", token, { httpOnly: true }); // Optionally, you can store the token in a cookie
    res.redirect("/home"); // Redirect to the home page
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/authentication", async (req, res) => {
  res.render("authentication.ejs");
});
app.get("/home", (req, res) => {
  res.render("home.ejs");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
