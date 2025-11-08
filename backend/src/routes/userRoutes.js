// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

router.put("/update", authMiddleware.required, (req, res) => UserController.update(req, res));
router.put("/password", authMiddleware.required, (req, res) => UserController.changePassword(req, res));

module.exports = router;
