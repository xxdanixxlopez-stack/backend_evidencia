const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

function initFirebaseAdmin() {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log(" Firebase Admin inicializado");
  }
  return admin;
}

module.exports = { initFirebaseAdmin };