const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

// MongoDB Connection
const uri = "mongodb+srv://grandzone:grandzone123@cluster0.nvelbne.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);
const dbName = "grandzone";
const collectionName = "products";

// Connect and cache DB
let collection;

async function connectToDB() {
  try {
    await client.connect();
    const db = client.db(dbName);
    collection = db.collection(collectionName);
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}

connectToDB();

// 📥 Get all products
app.get("/products", async (req, res) => {
  try {
    const products = await collection.find({}).toArray();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ➕ Add a product
app.post("/products", async (req, res) => {
  const product = req.body;
  try {
    const result = await collection.insertOne(product);
    res.json({ insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Failed to add product" });
  }
});

// ❌ Delete a product by ID
app.delete("/products/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ deletedId: id });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
