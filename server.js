const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;
const DATA_FILE = "products.json";

app.use(cors());
app.use(express.json({ limit: '20mb' }));


function loadProducts() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

function saveProducts(products) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
}

app.get("/products", (req, res) => {
  const products = loadProducts();
  res.json(products);
});

app.post("/products", (req, res) => {
  const products = loadProducts();
  const newProduct = req.body;
  newProduct.id = Date.now();
  products.push(newProduct);
  saveProducts(products);
  res.status(201).json(newProduct);
});

app.delete("/products/:id", (req, res) => {
  let products = loadProducts();
  const id = parseInt(req.params.id);
  products = products.filter(p => p.id !== id);
  saveProducts(products);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
