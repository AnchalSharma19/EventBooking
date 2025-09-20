const express = require("express");
const router = express.Router();
const { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent } = require("../controllers/eventController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Admin routes
router.post("/", verifyToken, isAdmin, createEvent);
router.put("/:id", verifyToken, isAdmin, updateEvent);
router.delete("/:id", verifyToken, isAdmin, deleteEvent);

// Public routes
router.get("/", getAllEvents);
router.get("/:id", getEventById);

module.exports = router;
