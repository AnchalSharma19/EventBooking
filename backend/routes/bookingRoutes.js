const express = require("express");
const router = express.Router();

const {
  bookEvent,
  getMyBookings,
  getAllBookings
} = require("../controllers/bookingController");

const { verifyToken } = require("../middleware/authMiddleware");

// Routes
router.post("/", verifyToken, bookEvent);
router.get("/my", verifyToken, getMyBookings);
router.get("/admin", verifyToken, getAllBookings);

module.exports = router;
