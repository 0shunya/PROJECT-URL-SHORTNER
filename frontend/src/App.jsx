import React, { useState } from "react";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [page, setPage] = useState("login");

  function handleLogin(t) {
    localStorage.setItem("token", t);
    setToken(t);
    setPage("dashboard");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    setPage("login");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold">URL Shortener</h1>
          <nav>
            {!token ? (
              <>
                <button className="mr-2" onClick={() => setPage("signup")}>
                  Signup
                </button>
                <button onClick={() => setPage("login")}>Login</button>
              </>
            ) : (
              <>
                <button onClick={() => setPage("dashboard")}>Dashboard</button>
                <button className="ml-4" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </nav>
        </header>

        <main className="bg-white p-6 rounded shadow">
          {!token && page === "signup" && (
            <Signup onSigned={() => setPage("login")} />
          )}
          {!token && page === "login" && <Login onLogged={handleLogin} />}
          {token && <Dashboard token={token} />}
        </main>
      </div>
    </div>
  );
}
