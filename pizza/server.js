// server.js
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

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

app.get("/orders/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const order = orders.find(o => o.id === id)

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  res.json(order);
});

app.post("/orders", (req, res) => {
  const { name, pizza } = req.body;

  if (!name || !pizza) {
    return res.status(400).json({ error: "Name and pizza is required!" });
  }

  const newId = orders.length ? orders[orders.length - 1].id + 1 : 1;

  const newOrder = { id: newId, name, pizza };

  orders.push(newOrder);

  res.status(201).json(newOrder);
});




app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});