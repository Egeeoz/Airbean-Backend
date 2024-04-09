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
  const { userName, email, password } = req.body;

  try {
    const existingUser = await db.findOne({ $or: [{ userName }, { email }] });
    if (existingUser) {
      res.status(409).json("Account already exists");
    } else {
      const newUser = {
        userName,
        email,
        password,
        orders: [],
      };

      const user = await db.insert(newUser);
      res.status(201).json(user);
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
