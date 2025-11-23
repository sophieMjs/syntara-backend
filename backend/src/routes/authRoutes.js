const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", (req, res) => AuthController.register(req, res));
router.post("/login", (req, res) => AuthController.login(req, res));
router.get("/profile", authMiddleware.required, (req, res) => AuthController.profile(req, res));

module.exports = router;
