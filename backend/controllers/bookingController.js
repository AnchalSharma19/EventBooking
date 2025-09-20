// controllers/bookingController.js
const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Event = require("../models/Event");

//  Book ticket
exports.bookEvent = async (req, res) => {
  try {
    const { eventId, ticketsBooked, totalAmount, transactionId, payerEmail } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!eventId || !ticketsBooked || !totalAmount) {
      return res.status(400).json({ message: "Missing required booking fields" });
    }

    // Validate eventId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid eventId" });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check ticket availability
    if (ticketsBooked > event.ticketsAvailable) {
      return res.status(400).json({ message: "Not enough tickets available" });
    }

    // Create booking
    const booking = new Booking({
  user: req.user.userId, 
  event: eventId,
  ticketsBooked,
  totalAmount,
  transactionId,
  payerEmail,
  paymentStatus: "paid",
});

    await booking.save();

    // Update event tickets
    event.ticketsAvailable -= ticketsBooked;
    await event.save();

    res.status(201).json({ message: "Booking successful", booking });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get my bookings
exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const bookings = await Booking.find({ user: userId }).populate("event");
    res.status(200).json({ bookings });
  } catch (err) {
    console.error("Get my bookings error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all bookings (admin)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("event").populate("user");
    res.status(200).json({ bookings });
  } catch (err) {
    console.error("Get all bookings error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
