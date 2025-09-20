import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/bookings/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error("Failed to load bookings:", err);
      alert("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Show loading
  if (loading) {
    return (
      <div className="text-center mt-5">
        <h4>Loading your bookings...</h4>
      </div>
    );
  }

  // Show message if no bookings
  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center mt-5">
        <h4 className="mb-3">You have no bookings yet.</h4>
        <button className="btn btn-primary" onClick={() => navigate("/home")}>
          🏠 Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Bookings</h2>
        <button className="btn btn-secondary" onClick={() => navigate("/home")}>
          🏠 Home
        </button>
      </div>

      {/* Bookings Grid */}
      <div className="row g-4">
        {bookings.map((b) => (
          <div key={b._id} className="col-md-6 col-lg-4">
            <div className="card shadow-sm h-100 border-0">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title mb-2 text-primary">
                  {b.event ? b.event.title : "Event deleted"}
                </h5>
                <p className="card-text mb-3 text-muted">
                  📅 <strong>Date:</strong>{" "}
                  {b.event ? new Date(b.event.date).toLocaleString() : "-"} <br />
                  🎟 <strong>Tickets Booked:</strong> {b.ticketsBooked} <br />
                  💰 <strong>Total Paid:</strong> ₹{b.totalAmount} <br />
                  ✅ <strong>Payment Status:</strong> {b.paymentStatus}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
