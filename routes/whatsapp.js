const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

router.get("/link", async (req, res) => {
  try {
    const { productId, qty = 1 } = req.query;
    const phone = process.env.BUSINESS_PHONE;
    if (!phone) return res.status(500).json({ message: "BUSINESS_PHONE no configurado" });

    const prod = await Product.findById(productId).populate("category", "name");
    if (!prod) return res.status(404).json({ message: "Producto no encontrado" });

    const msg =
      `Hola, me interesa este producto:\n` +
      `• ${prod.name}\n` +
      (prod.brand ? `• Marca: ${prod.brand}\n` : "") +
      `• Categoría: ${prod.category?.name}\n` +
      `• Cantidad: ${qty}\n` +
      `¿Está disponible?`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    res.json({ url, message: msg });
  } catch (e) {
    console.error("whatsapp error:", e);
    res.status(500).json({ message: "Error generando link", error: e.message });
  }
});

module.exports = router;