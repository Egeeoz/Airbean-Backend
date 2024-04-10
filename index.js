const express = require("express");
const Datastore = require("nedb-promises");
const fs = require("node:fs");
const app = express();

const PORT = 8000;
const URL = "127.0.0.1";

app.use(express.json());

const db = new Datastore({ filename: "database.db", autoload: true });

const server = app.listen(PORT, URL, () => {
  console.log(`listening to port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Go to /api/menu for menu");
});

app.get("/api/menu", async (req, res) => {
  const data = fs.readFile();
  try {
    const data = fs.readFile(
      "/js_2023_GhostExperts_AirbeanBackend/menu.json",
      "utf8"
    );
    console.log(data);
  } catch (err) {
    console.error(err);
  }
  // res.send(menu);
  // try {
  //   const menu = await db.find({ menu: { $exists: true } });

  //   if (menu && menu.menu) {
  //     res.status(200).json(menu.menu);
  //   } else {
  //     res.status(404).send("Menu not found");
  //   }
  // } catch (error) {
  //   res.status(500).send("Internal server error");
  // }
});

app.post("/api/signup", async (req, res) => {
  // deconstructing
  const { userName, email, password } = req.body;

  try {
    // Looking for user with email and username
    const existingUser = await db.findOne({ $or: [{ userName }, { email }] });
    // If user with thoose credentials exists then send message that account already exists
    if (existingUser) {
      res.status(409).json("Account already exists");
    } else {
      // Otherwise take the given info and put them into the new user
      const newUser = {
        userName,
        email,
        password,
        orders: [],
      };
      // Send the new user info into the database and return the created account
      const user = await db.insert(newUser);
      res.status(201).json(user);
    }
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

app.post("/api/login", async (req, res) => {
  // deconstructing
  const { userName, email, password } = req.body;

  let userCredential;
  // If user tries to log in with both email and username send message to only try to login with email OR username
  if (userName && email) {
    return res.status(400).send("Please provide a userName or email");
  }

  // User logins with username
  if (userName) {
    userCredential = { userName };
  } else if (email) {
    // User logins with email
    userCredential = { email };
  } else {
    // If no username or email is provided, return message
    return res.status(400).send("Please provide a userName or email");
  }

  try {
    // Find the user with the given credential and save it into an variable
    const user = await db.findOne(userCredential);
    // Check if user password match given user credential
    if (user && user.password == password) {
      // If it matches, log in
      res.status(200).json({ message: "Login Successful", user });
    } else {
      // If it does not match, return message (no login)
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});
//user
//user/orderHistory

//login
//logout ?
//menu
//order
