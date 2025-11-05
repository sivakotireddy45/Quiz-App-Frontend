import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await API.post("/auth/register", form);
      if (data.success) {
        login(data.user, data.token);
        navigate("/quiz");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg p-6 rounded-lg mt-12">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input type="text" name="name" placeholder="Name" onChange={handleChange} className="border p-2 rounded" required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="border p-2 rounded" required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="border p-2 rounded" required />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Register</button>
      </form>
    </div>
  );
}
