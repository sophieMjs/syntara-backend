// routes/searchRoutes.js
const express = require("express");
const router = express.Router();
const { search } = require("../controllers/searchController");
const authMiddleware = require("../middlewares/authMiddleware");

// El middleware "authMiddleware" en tu proyecto es un objeto con .optional y .required.
// Para permitir búsquedas tanto por invitados como por usuarios autenticados usamos .optional.
router.post("/", authMiddleware.optional, search);

module.exports = router;
