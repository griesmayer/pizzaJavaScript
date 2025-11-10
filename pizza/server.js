// server.js
const express = require("express");
const app = express();
const port = 3000;

const orders = [
  { id:  1, name: "Anna",    pizza: "Paesana" },
  { id:  2, name: "Susi",    pizza: "Broccoli" },
  { id:  3, name: "Fritz",   pizza: "Rucola" },
  { id:  4, name: "Andrea",  pizza: "Broccoli" },
  { id:  5, name: "Thomas",  pizza: "Paesana" },
  { id:  6, name: "Verena",  pizza: "Rucola" },
  { id:  7, name: "Marion",  pizza: "Broccoli" },
  { id:  8, name: "Karl",    pizza: "Capricciosa" },
  { id:  9, name: "Hans",    pizza: "Diavola" },
  { id: 10, name: "Barbara", pizza: "Capricciosa" }
];

app.get("/", (req, res) => {
  res.send("Hello, Thomas, Andrea and World from Express!");
});

app.get("/orders", (req, res) => {
  res.json(orders);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});