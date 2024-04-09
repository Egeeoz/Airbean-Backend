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

app.get("/api/menu", (req, res) => {
  db.findOne({ menu: { $exists: true } })
    .then((doc) => {
      if (doc) {
        res.json(doc.menu);
      } else {
        res.status(404).send("Menu not found");
      }
    })
    .catch((err) => {
      res.status(500).send("Internal Server Error");
    });
});
