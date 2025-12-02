import React, { useEffect, useState } from "react";
import { createShort, listCodes, deleteCode } from "../api";

export default function Dashboard({ token }) {
  const [form, setForm] = useState({ url: "", code: "" });
  const [codes, setCodes] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    try {
      const res = await listCodes(token);
      setCodes(res);
    } catch (err) {
      setError(err.message || "Failed to load codes");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    try {
      await createShort(form, token);
      setForm({ url: "", code: "" });
      load();
    } catch (err) {
      setError(err.message || "Create failed");
    }
  }

  async function handleDelete(id) {
    try {
      await deleteCode(id, token);
      load();
    } catch (err) {
      setError(err.message || "Delete failed");
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      {error && <div className="text-red-600">{error}</div>}
      <form onSubmit={handleCreate} className="space-y-2">
        <input
          required
          placeholder="Target URL (https://...)"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          className="w-full border p-2"
        />
        <input
          placeholder="Custom code (optional)"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          className="w-full border p-2"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Create short URL
        </button>
      </form>

      <section>
        <h3 className="font-semibold">Your codes</h3>
        <ul className="space-y-2 mt-2">
          {codes.length === 0 && <li>No codes yet</li>}
          {codes.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between border p-2 rounded"
            >
              <div>
                <div className="font-medium">{c.shortCode}</div>
                <div className="text-sm text-gray-600">{c.targetURL}</div>
              </div>
              <div className="flex items-center">
                <a
                  className="text-blue-600 mr-4"
                  href={`http://localhost:8000/${c.shortCode}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open
                </a>
                <button
                  className="text-red-600"
                  onClick={() => handleDelete(c.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
