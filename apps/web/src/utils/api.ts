const API_BASE = "http://localhost:8080/api/v1"; // 

// ---------------- Workflows ----------------
export const fetchWorkflows = async (token: string) => {
  const res = await fetch(`${API_BASE}/workflow/getAll`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch workflows");
  return res.json();
};

export const fetchWorkflowById = async (id: string, token: string) => {
  const res = await fetch(`${API_BASE}/workflow/get/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch workflow");
  return res.json();
};

export const createWorkflow = async (
  body: any,
  token: string
): Promise<any> => {
  const res = await fetch(`${API_BASE}/workflow/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to create workflow");
  return res.json();
};

export const updateWorkflow = async (
  id: string,
  body: any,
  token: string
): Promise<any> => {
  const res = await fetch(`${API_BASE}/workflow/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to update workflow");
  return res.json();
};

// ---------------- Credentials ----------------
export const fetchCredentials = async (token: string) => {
  const res = await fetch(`${API_BASE}/credentials/getAll`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch credentials");
  return res.json();
};

export const createCredential = async (body: any, token: string) => {
  const res = await fetch(`${API_BASE}/credentials/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to create credential");
  return res.json();
};

export const updateCredential = async (
  id: string,
  body: any,
  token: string
) => {
  const res = await fetch(`${API_BASE}/credentials/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to update credential");
  return res.json();
};

export const deleteCredential = async (id: string, token: string) => {
  const res = await fetch(`${API_BASE}/credentials/delete/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete credential");
  return res.json();
};
