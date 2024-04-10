const express = require("express");
const Datastore = require("nedb-promises");
const fs = require("node:fs");
const app = express();

const PORT = 8000;
const URL = "127.0.0.1";

app.use(express.json());

// const db = new Datastore({ filename: "database.db", autoload: true });

db = {};
db.users = new Datastore({ filename: "users.db", autoload: true });
db.orders = new Datastore({ filename: "orders.db", autoload: true });
db.userOrders = new Datastore({ filename: "userOrders.db", autoload: true });

const server = app.listen(PORT, URL, () => {
  console.log(`listening to port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Go to /api/menu for menu");
});

//get menu from menu.json and parse it and send it as response.
app.get("/api/menu", async (req, res) => {
  fs.readFile("menu.json", "utf8", (err, data) => {
    if (err) {
      // If there's an error reading the file
      console.error(err);
      res.status(500).send("Error reading menu data");
      return;
    }
    // If the file is read successfully, parse the JSON and send it as response
    try {
      const menuData = JSON.parse(data);
      res.json(menuData);
      const foundData = menuData.menu.find(
        (item) => item.title === "Bryggkaffe" && item.price === 39
      );
      console.log(foundData);
    } catch (error) {
      // If there's an error parsing
      console.error(error);
      res.status(500).send("Problem parsing data");
    }
  });
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

// reads menu. and compares if req.body can be found in menu
app.post("/api/order", async (req, res) => {
  const { title, price } = req.body;
  const orderData = { title, price };
  console.log(orderData);
  let menu;
  fs.readFile("menu.json", "utf8", async (err, data) => {
    if (err) {
      // If there's an error reading the file
      console.error(err);
      res.status(500).send("Error reading menu data");
      return;
    }
    // If the file is read successfully, parse the JSON and send it as response
    try {
      const menuData = JSON.parse(data);
      menu = await menuData.menu;
      // console.log(menu);
      const orderItems = menu.find(
        (item) =>
          item.title === orderData.title && item.price === orderData.price
      );
      console.log(orderItems);
      if (!orderItems) {
        res.status(404).send("not found in menu");
        return;
      } else {
        await db.orders.insert(orderItems);
        res
          .status(201)
          .json({ message: "order added successfully", orderItems });
      }
    } catch (error) {
      // If there's an error parsing
      console.error(error);
      // res.status(500).send("Problem parsing data");
      res.status(500).send("Server problems, no order was added");
    }
  });

  // try {
  //   const orderData = { title, price };
  //   const orderItems = menu.find(
  //     (item) => item.titel === orderData.title && item.titel === orderData.price
  //   );
  // if (!orderItems) {
  //   res.status(404).send("not found in menu");
  //   return;
  // } else {
  //   await db.orders.insert(orderItems);
  //   res.status(201).json({ message: "order added successfully", orderItems });
  // }
  // } catch (error) {
  //   res.status(500).send("Server problems, no order was added");
  // }
});

//user
//user/orderHistory

//login
//logout ?
//menu
//order
