const express = require("express");
const Product = require("../models/Product");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

// PUBLIC: lista
router.get("/", async (req, res) => {
  try {
    const { categoryId } = req.query;
    const filter = categoryId ? { category: categoryId } : {};
    const data = await Product.find(filter)
      .populate("category", "name")
      .sort({ createdAt: -1 });
    res.json(data);
  } catch (e) {
    console.error("products GET error:", e);
    res.status(500).json({ message: "Error leyendo productos", error: e.message });
  }
});

// PUBLIC: detalle
router.get("/:id", async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id).populate("category", "name");
    if (!prod) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(prod);
  } catch (e) {
    console.error("product detail error:", e);
    res.status(500).json({ message: "Error leyendo producto", error: e.message });
  }
});

// ADMIN
router.post("/", requireAdmin, async (req, res) => {
  try {
    const created = await Product.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ message: "Error creando producto", error: e.message });
  }
});

router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ message: "Error actualizando producto", error: e.message });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Producto eliminado" });
  } catch (e) {
    res.status(400).json({ message: "Error eliminando producto", error: e.message });
  }
});

module.exports = router;