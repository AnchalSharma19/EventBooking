import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      const decoded = jwtDecode(res.data.token);

      if (decoded.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home"); // non-admin users
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-sm p-4" style={{ maxWidth: "400px", width: "100%", borderRadius: "10px" }}>
        <h2 className="text-center mb-4">Welcome Back</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <button className="btn btn-primary w-100 mb-3" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="text-center">
          <span>New user? </span>
          <Link to="/register" className="text-decoration-none fw-bold">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
