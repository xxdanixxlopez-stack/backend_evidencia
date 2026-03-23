const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  uid: String,
  email: String,
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      price: Number,
      qty: Number
    }
  ],
  total: Number,
  status: { type: String, default: "pendiente" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);