const express = require("express");
const Datastore = require("nedb-promises");
const fs = require("node:fs");
const _ = require("lodash");
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
    const existingUser = await db.users.findOne({
      $or: [{ userName }, { email }],
    });
    // If user with thoose credentials exists then send message that account already exists
    if (existingUser) {
      res.status(409).json("Account already exists");
    } else {
      // Otherwise take the given info and put them into the new user
      const newUser = {
        userName,
        email,
        password,
      };
      // Send the new user info into the database and return the created account
      const user = await db.users.insert(newUser);
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
    const user = await db.users.findOne(userCredential);
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

app.get("/api/user/:userId", async (req, res) => {
  // Storing given user _id from endpoint
  const userId = req.params.userId;

  try {
    // Searching for the user with given _id and storing the user info in a variable
    const user = await db.users.findOne({ _id: userId });
    // If a user was found with the given _id then return the user information
    if (user) {
      res.status(200).json(user);
    } else {
      // If there is no user with such _id, return message below
      res.status(404).send("No user with such ID");
    }
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

// reads menu. and compares if req.body can be found in menu
app.post("/api/order", async (req, res) => {
  //how the body in postman looks like
  //   {
  //     "order": [
  //         {
  //             "title": ",
  //             "price":
  //         },
  //         {
  //             "title": "",
  //             "price":
  //         }
  //     ]
  // }
  const { order, userId } = req.body;
  const orderData = { order, userId };
  let menu;
  console.log(orderData);
  // reads menu. and compares if req.body can be found in menu
  //reading the menu.json and saves it as menu
  fs.readFile("menu.json", "utf8", async (err, data) => {
    if (err) {
      // If there's an error reading the file
      res.status(500).send("Error reading menu data");
      return;
    }
    try {
      const menuData = JSON.parse(data);
      menu = await menuData.menu;
      //checks every menuitem with orderitem for both title and price
      const orderIsValid = orderData.order.every((orderItem) => {
        const menuItem = menu.find(
          (menuItem) =>
            menuItem.title === orderItem.title &&
            menuItem.price === orderItem.price
        );
        return !!menuItem;
      });
      // if the order was not correct
      if (!orderIsValid) {
        res.status(404).send("not found in menu");
        return;

        //if orderIsValid, the order is added to the database
      } else {
        // if there's any value in userID, it check if there's any user with the given id,
        if (userId.length) {
          const existingUser = await db.users.findOne({
            _id: orderData.userId,
          });
          if (!existingUser) {
            res
              .status(404)
              .send("Could not find user, please check userId and try again");
            return;
          }
        }
        //adds the sum of the total of the order
        let total = 0;
        orderData.order.forEach((orderItem) => {
          total += orderItem.price;
        });
        //random eta 5-30 min
        const eta = _.random(5, 30);
        orderData.total = total;
        orderData.eta = eta;
        //adds to orders db
        await db.orders.insert(orderData);
        res.status(201).json({
          message: "order added successfully",
          orderData,
        });
        return;
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Server problems, no order was added");
      return;
    }
  });
});

app.get("/api/user/:id/orderhistory", async (req, res) => {
  const user = req.params.id;
  try {
    const existingUser = await db.users.findOne({
      _id: user,
    });
    if (!existingUser) {
      res
        .status(404)
        .send({ message: "Could not found any user with given id" });
    }
    const orderHistoryData = await db.orders.find({ userId: user });

    res.status(201).send({
      message: "OrderHistory",
      orders: orderHistoryData,
    });
  } catch (error) {
    res.status(500).send("Server problems, try again");
  }
});

//user-
//user/orderHistory-
//login-
//logout ?
//menu-
//order-

// orderDate?
//Få till res på orderhistory mer cleant
//"orderHistory": [
// {
//   "total": 0,
//   "orderNr": "string",
//   "orderDate": "string"
// }

//pusha in userorders till users?
