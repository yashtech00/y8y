// src/utils/api.ts
export const API_URL = "http://localhost:8080/api/v1"; // adjust to your backend

export async function fetchWorkflows(token: string) {
  const res = await fetch(`${API_URL}/workflow/getAll`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch workflows");
  return res.json();
}

export async function updateWorkflow(id: string, data: any, token: string) {
  const res = await fetch(`${API_URL}/workflow/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update workflow");
  return res.json();
}
