const admin = require("firebase-admin");

const ADMIN_EMAILS = [
  "xxdanixxlopez@gmail.com",
  "bryanfabrizzio33@gmail.com"
].map((e) => e.toLowerCase());

// Middleware para usuarios autenticados
async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Falta token Bearer" });
    }

    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Token inválido", error: e.message });
  }
}

// Middleware para administradores (el que necesitas para crear categorías)
async function requireAdmin(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Falta token Bearer" });
    }

    const decoded = await admin.auth().verifyIdToken(token);
    const email = (decoded.email || "").toLowerCase();

    if (!ADMIN_EMAILS.includes(email)) {
      return res.status(403).json({ message: "No autorizado: solo administrador" });
    }

    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Token inválido", error: e.message });
  }
}

module.exports = { requireAuth, requireAdmin };