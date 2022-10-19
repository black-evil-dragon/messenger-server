const functions = require("firebase-functions");

const express = require("express");
const app = express();
require("../src/routes/routes")(app);

exports.app = functions.https.onRequest(app);
