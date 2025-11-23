const express = require("express");
const router = express.Router();
const { search } = require("../controllers/searchController");
const searchController = require("../controllers/searchController");
const authMiddleware = require("../middlewares/authMiddleware");
const checkSubscriptionLimit = require("../middlewares/checkSubscriptionLimit");

router.get("/",
    authMiddleware.optional,
    checkSubscriptionLimit,
    searchController.search
);
router.post("/", authMiddleware.optional, searchController.search);

router.get("/history", authMiddleware.required, searchController.getHistory);
router.delete("/history", authMiddleware.required, searchController.clearHistory);

router.get("/", authMiddleware.optional, searchController.search);
router.get("/wholesale", authMiddleware.required, searchController.wholesaleSearch);

module.exports = router;