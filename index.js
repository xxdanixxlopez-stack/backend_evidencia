require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { initFirebaseAdmin } = require("./firebaseAdmin");
initFirebaseAdmin();

const categoriesRoutes = require("./routes/categories");
const productsRoutes = require("./routes/products");
const searchRoutes = require("./routes/search");
const whatsappRoutes = require("./routes/whatsapp");
const ordersRoutes = require("./routes/orders");

const app = express();
app.use(express.json());

app.use(
  cors({
    origin:"*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.get("/", (req, res) => res.send("API OK"));

app.use("/api/categories", categoriesRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/orders", ordersRoutes);

app.use((err, req, res, next) => {
  console.error("ERROR GLOBAL:", err);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB conectado");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server corriendo en puerto ${PORT}`));
  })
  .catch((e) => console.error("Error MongoDB:", e.message));