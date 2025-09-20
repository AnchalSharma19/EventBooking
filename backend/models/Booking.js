const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ticketsBooked: { type: Number, required: true, min: 1 },
    totalAmount: { type: Number, required: true },
    transactionId: { type: String },
    payerEmail: { type: String },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
