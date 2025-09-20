import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    price: "",
    ticketsAvailable: "",
  });

  const [searchData, setSearchData] = useState({
    title: "",
    location: "",
    date: "",
  });

  const navigate = useNavigate();

  // Fetch events
  const fetchEvents = async () => {
    try {
      const res = await axios.get("/events");
      setEvents(res.data);
      setFilteredEvents(res.data);
    } catch (err) {
      alert("Failed to load events");
      console.error(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const createEvent = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/events", {
        ...formData,
        date: new Date(formData.date).toISOString(),
      });
      alert("Event created successfully!");
      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        price: "",
        ticketsAvailable: "",
      });
      fetchEvents();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Event creation failed: " + (err.response?.data?.message || err.message));
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await axios.delete(`/events/${id}`);
      alert("Event deleted");
      fetchEvents();
    } catch (err) {
      alert("Delete failed");
      console.error(err.response?.data || err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Search/filter logic
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

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">Admin Dashboard</h2>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Event Creation Form */}
      <div className="card shadow-sm p-4 mb-5" style={{ borderRadius: "12px", backgroundColor: "#f8f9fa" }}>
        <h4 className="mb-3 text-secondary">Create New Event</h4>
        <form onSubmit={createEvent}>
          <div className="row g-2">
            <div className="col-md-6">
              <input
                name="title"
                value={formData.title}
                onChange={handleInput}
                placeholder="Title"
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6">
              <input
                name="location"
                value={formData.location}
                onChange={handleInput}
                placeholder="Location"
                className="form-control"
              />
            </div>
            <div className="col-md-6">
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleInput}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6">
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInput}
                placeholder="Price"
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6">
              <input
                type="number"
                name="ticketsAvailable"
                value={formData.ticketsAvailable}
                onChange={handleInput}
                placeholder="Tickets Available"
                className="form-control"
                required
              />
            </div>
            <div className="col-md-12">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInput}
                placeholder="Description"
                className="form-control"
                rows="3"
              />
            </div>
          </div>
          <button className="btn btn-primary mt-3">Create Event</button>
        </form>
      </div>

      {/* Events List */}
      <h4 className="mb-3 text-secondary">All Events</h4>

      {/* Search/Filter Form */}
      <div className="card shadow-sm p-3 mb-4" style={{ borderRadius: "10px", backgroundColor: "#f1f3f5" }}>
        <h5 className="mb-3">Filter Events</h5>
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

      {/* Filtered Events */}
      <div className="row g-3">
        {filteredEvents.map((event) => (
          <div key={event._id} className="col-md-4">
            <div className="card h-100 shadow-sm" style={{ borderRadius: "12px" }}>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-primary">{event.title}</h5>
                <p className="card-text text-muted">{event.description}</p>
                <p className="mb-2">
                  <strong>📍 {event.location || "N/A"}</strong><br />
                  <strong>📅 {new Date(event.date).toLocaleString()}</strong><br />
                  <strong>🎟 ₹{event.price}</strong><br />
                  <strong>🧾 Tickets: {event.ticketsAvailable}</strong>
                </p>
                <button
                  className="btn btn-outline-danger mt-auto"
                  onClick={() => deleteEvent(event._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredEvents.length === 0 && (
          <p className="text-center text-muted mt-3">No events found matching the filter.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
