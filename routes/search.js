const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json([]);

    const regex = new RegExp(q, "i");
    const results = await Product.find({
      $or: [{ name: regex }, { brand: regex }, { description: regex }]
    })
      .populate("category", "name")
      .limit(40);

    res.json(results);
  } catch (e) {
    console.error("search error:", e);
    res.status(500).json({ message: "Error en búsqueda", error: e.message });
  }
});

module.exports = router;