const BASE_URL = "http://10.222.58.153:5000/";


async function request(path, method = "GET", body, token) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "Request failed");
  }

  return res.json();
}

export default {
  get: (path, token) => request(path, "GET", undefined, token),
  post: (path, body, token) => request(path, "POST", body, token),
  put: (path, body, token) => request(path, "PUT", body, token),
  del: (path, token) => request(path, "DELETE", undefined, token),
};
