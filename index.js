const express = require("express");
const Datastore = require("nedb-promises");

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
  try {
    const menu = await db.findOne({ menu: { $exists: true } });

    if (menu && menu.menu) {
      res.status(200).json(menu.menu);
    } else {
      res.status(404).send("Menu not found");
    }
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});
