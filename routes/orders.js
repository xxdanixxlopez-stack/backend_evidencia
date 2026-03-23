const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middleware/auth");
const Order = require("../models/order");

router.post("/", requireAuth, async (req, res) => {
  try {
    const { items, total } = req.body;

    const order = await Order.create({
      uid: req.user.uid,
      email: req.user.email,
      items,
      total,
      status: "pendiente"
    });

    res.status(201).json(order);
  } catch (e) {
    console.error("orders POST error:", e);
    res.status(500).json({ message: "Error guardando orden", error: e.message });
  }
});

router.get("/", requireAuth, async (req, res) => {
  try {
    const data = await Order.find({ uid: req.user.uid }).sort({ createdAt: -1 });
    res.json(data);
  } catch (e) {
    console.error("orders GET error:", e);
    res.status(500).json({ message: "Error leyendo órdenes", error: e.message });
  }
});

module.exports = router;