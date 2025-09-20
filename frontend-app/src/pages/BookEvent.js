import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axiosConfig";

const BookEvent = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState(1);
  const paypalRef = useRef();
  const navigate = useNavigate();

  const loadPaypalScript = (clientId) => {
    return new Promise((resolve) => {
      if (document.getElementById("paypal-sdk")) return resolve();
      const script = document.createElement("script");
      script.id = "paypal-sdk";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
      script.onload = resolve;
      script.onerror = () => console.error("Failed to load PayPal SDK");
      document.body.appendChild(script);
    });
  };

  // Fetch event details
  const fetchEvent = async () => {
    try {
      const res = await axios.get(`/events/${eventId}`);
      setEvent(res.data);
    } catch (err) {
      console.error("Error fetching event:", err.response?.data || err.message);
      alert("❌ Event not found.");
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  // Setup PayPal buttons
  useEffect(() => {
    let isMounted = true;

    const setupPaypal = async () => {
      if (!event || !isMounted) return;

      await loadPaypalScript(
        "AdRWKIhaf1M4nHVNNQiHBZfx5zgvOHONzS4XnnjzCc57Ko5bHseTUqmnS7S_sclJCJorf8PPDa1pHfrx" // Sandbox client ID
      );

      if (!window.paypal || !isMounted) {
        console.error("PayPal SDK not loaded or component unmounted!");
        return;
      }

      paypalRef.current.innerHTML = "";

      window.paypal.Buttons({
        style: { layout: "vertical", color: "gold", shape: "rect", label: "paypal" },

        // Create order
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                description: event.title,
                amount: { currency_code: "USD", value: (event.price * tickets).toFixed(2) },
              },
            ],
          });
        },

        // Capture payment and save booking
        onApprove: async (data, actions) => {
          try {
            const payment = await actions.order.capture();
            console.log("Payment completed:", payment);

            const token = localStorage.getItem("token");

const res = await axios.post(
  "/bookings",
  {
    eventId: event._id,            
    ticketsBooked: tickets,        
    totalAmount: event.price * tickets,
    transactionId: payment.id,    
    payerEmail: payment.payer.email_address 
  },
  { headers: { Authorization: `Bearer ${token}` } }
);


            if (res.data?.message === "Booking successful") {
              alert("✅ Booking successful!");
              navigate("/my-bookings");
            } else {
              console.error("Booking failed response:", res.data);
              alert("❌ Booking failed.");
            }
          } catch (err) {
            console.error("Booking error:", err.response?.data || err.message);
            alert("❌ Booking failed.");
          }
        },

        onError: (err) => {
          console.error("PayPal error:", err);
          alert("❌ Payment failed.");
        },
      }).render(paypalRef.current);
    };

    setupPaypal();

    return () => {
      isMounted = false;
    };
  }, [event, tickets, navigate]);

  if (!event) return <p>Loading event...</p>;

  return (
    <div className="col-md-6 offset-md-3 mt-4">
      <h4>Booking for: {event.title}</h4>
      <p>Date: {new Date(event.date).toLocaleString()}</p>
      <p>Price per ticket: ₹{event.price}</p>

      <div className="mb-3">
        <label>Number of Tickets:</label>
        <input
          type="number"
          className="form-control"
          value={tickets}
          min={1}
          max={event.ticketsAvailable}
          onChange={(e) => setTickets(Number(e.target.value))}
        />
      </div>

      <div ref={paypalRef}></div>
    </div>
  );
};

export default BookEvent;
