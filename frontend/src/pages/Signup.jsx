import React, { useState } from "react";
import { signup } from "../api";

export default function Signup({ onSigned }) {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await signup(form);
      onSigned();
    } catch (err) {
      setError(err.message || "Signup failed");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Create account</h2>
      {error && <div className="text-red-600">{error}</div>}
      <input
        required
        placeholder="First name"
        value={form.firstname}
        onChange={(e) => setForm({ ...form, firstname: e.target.value })}
        className="w-full border p-2"
      />
      <input
        placeholder="Last name"
        value={form.lastname}
        onChange={(e) => setForm({ ...form, lastname: e.target.value })}
        className="w-full border p-2"
      />
      <input
        required
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full border p-2"
      />
      <input
        required
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="w-full border p-2"
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Sign up
      </button>
    </form>
  );
}
