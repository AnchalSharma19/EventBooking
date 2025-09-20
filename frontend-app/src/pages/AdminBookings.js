import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("/bookings/admin"); 
      setBookings(res.data);
    } catch (err) {
      alert("Failed to load bookings");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (bookings.length === 0) return <p>No bookings yet.</p>;

  return (
    <div>
      <h2>All Bookings (Admin)</h2>
      <div className="row">
        {bookings.map((b) => (
          <div key={b._id} className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <h5>{b.event.title}</h5>
                <p>
                  📅 {new Date(b.event.date).toLocaleString()} <br />
                  👤 User: {b.user.name} ({b.user.email}) <br />
                  🎟 Tickets Booked: {b.ticketsBooked} <br />
                  💰 Total Paid: ₹{b.totalAmount} <br />
                  ✅ Payment Status: {b.paymentStatus}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBookings;
