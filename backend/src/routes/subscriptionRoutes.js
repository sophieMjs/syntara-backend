const express = require("express");
const router = express.Router();
const SubscriptionController = require("../controllers/subscriptionController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/assign", authMiddleware.required, (req, res) =>
    SubscriptionController.assign(req, res)
);

router.post("/upgrade", authMiddleware.required, (req, res) =>
    SubscriptionController.upgrade(req, res)
);

router.get("/my-plan", authMiddleware.required, (req, res) =>
    SubscriptionController.getMyPlan(req, res)
);

module.exports = router;
