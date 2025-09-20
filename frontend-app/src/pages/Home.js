import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchData, setSearchData] = useState({
    title: "",
    location: "",
    date: "",
  });

  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const res = await axios.get("/events"); 
      setEvents(res.data);
      setFilteredEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSearchChange = (e) => {
    setSearchData({ ...searchData, [e.target.name]: e.target.value });
  };

  const handleFilter = (e) => {
    e.preventDefault();
    const { title, location, date } = searchData;
    const filtered = events.filter((event) => {
      const matchesTitle = event.title.toLowerCase().includes(title.toLowerCase());
      const matchesLocation = event.location?.toLowerCase().includes(location.toLowerCase());
      const matchesDate = date ? new Date(event.date).toDateString() === new Date(date).toDateString() : true;
      return matchesTitle && matchesLocation && matchesDate;
    });
    setFilteredEvents(filtered);
  };

  const handleResetFilter = () => {
    setSearchData({ title: "", location: "", date: "" });
    setFilteredEvents(events);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const goToMyBookings = () => {
    navigate("/my-bookings");
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">Upcoming Events</h2>
        <div>
          <button className="btn btn-outline-info me-2" onClick={goToMyBookings}>
            My Bookings
          </button>
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Search/Filter Form */}
      <div className="card shadow-sm p-3 mb-4" style={{ borderRadius: "10px", backgroundColor: "#f1f3f5" }}>
        <h5 className="mb-3">Search Events</h5>
        <form className="row g-2" onSubmit={handleFilter}>
          <div className="col-md-4">
            <input
              name="title"
              value={searchData.title}
              onChange={handleSearchChange}
              placeholder="Title"
              className="form-control"
            />
          </div>
          <div className="col-md-4">
            <input
              name="location"
              value={searchData.location}
              onChange={handleSearchChange}
              placeholder="Location"
              className="form-control"
            />
          </div>
          <div className="col-md-3">
            <input
              type="date"
              name="date"
              value={searchData.date}
              onChange={handleSearchChange}
              className="form-control"
            />
          </div>
          <div className="col-md-1 d-grid">
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </div>
          <div className="col-md-12 mt-2">
            <button type="button" className="btn btn-secondary" onClick={handleResetFilter}>
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Events List */}
      <div className="row g-4">
        {filteredEvents.length === 0 ? (
          <p className="text-center text-muted">No events found.</p>
        ) : (
          filteredEvents.map((event) => (
            <div className="col-md-4" key={event._id}>
              <div
                className={`card h-100 shadow-sm ${event.ticketsAvailable === 0 ? "border-danger" : ""}`}
                style={{ borderRadius: "12px", transition: "transform 0.2s" }}
              >
                <div className="card-body d-flex flex-column">
                  <h5 className={`card-title ${event.ticketsAvailable === 0 ? "text-danger" : "text-primary"}`}>
                    {event.title}
                  </h5>
                  <p className="card-text text-muted">{event.description}</p>
                  <p className="mb-2">
                    <strong>📍 {event.location || "N/A"}</strong><br />
                    <strong>📅 {new Date(event.date).toLocaleString()}</strong><br />
                    <strong>🎟 ₹{event.price}</strong><br />
                    <strong>🧾 Tickets Left: {event.ticketsAvailable}</strong>
                  </p>
                  <Link
                    to={`/book/${event._id}`}
                    className={`btn mt-auto ${event.ticketsAvailable > 0 ? "btn-primary" : "btn-secondary disabled"}`}
                  >
                    {event.ticketsAvailable > 0 ? "Book Now" : "Sold Out"}
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
