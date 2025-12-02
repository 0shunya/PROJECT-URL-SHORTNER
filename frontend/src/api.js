const BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, opts);
  if (!res.ok) {
    const text = await res.text();
    let err;
    try {
      err = JSON.parse(text);
    } catch {
      err = { message: text };
    }
    throw new Error(err.error?.message || err.message || JSON.stringify(err));
  }
  return res.json();
}

export async function signup(payload) {
  await request("/user/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function login(payload) {
  const data = await request("/user/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return data.token;
}

export async function createShort(payload, token) {
  return request("/shorten", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function listCodes(token) {
  const data = await request("/codes", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.codes || [];
}

export async function deleteCode(id, token) {
  return request(`/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
