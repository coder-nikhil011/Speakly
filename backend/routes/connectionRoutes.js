const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { requirePlan } = require("../middleware/planGuard");
const connectionController = require("../controllers/connectionController");

router.post("/request", authMiddleware, requirePlan("Premium"), connectionController.requestJoin);
router.get("/my-teachers", authMiddleware, connectionController.getMyTeachers);
router.get("/pending", authMiddleware, connectionController.getPendingRequests);
router.post("/handle", authMiddleware, connectionController.handleRequest);

module.exports = router;
