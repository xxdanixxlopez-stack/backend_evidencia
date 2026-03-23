const express = require("express");
const Category = require("../models/category");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

// PUBLIC
router.get("/", async (req, res) => {
  try {
    const data = await Category.find().sort({ name: 1 });
    res.json(data);
  } catch (e) {
    console.error("categories GET error:", e);
    res.status(500).json({ message: "Error leyendo categorías", error: e.message });
  }
});

// ADMIN
router.post("/", requireAdmin, async (req, res) => {
  try {
    const created = await Category.create({ name: req.body.name });
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ message: "Error creando categoría", error: e.message });
  }
});

router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (e) {
    res.status(400).json({ message: "Error actualizando categoría", error: e.message });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Categoría eliminada" });
  } catch (e) {
    res.status(400).json({ message: "Error eliminando categoría", error: e.message });
  }
});

module.exports = router;