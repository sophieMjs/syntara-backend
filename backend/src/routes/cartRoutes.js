const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cartController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware.required, (req, res) => CartController.getMyCart(req, res));
router.post("/add", authMiddleware.required, (req, res) => CartController.addItem(req, res));
router.delete("/item/:itemId", authMiddleware.required, (req, res) => CartController.removeItem(req, res));
router.delete("/clear", authMiddleware.required, (req, res) => CartController.clearCart(req, res));

module.exports = router;