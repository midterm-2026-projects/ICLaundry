const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const BASE_URL = `${API_BASE_URL}/staff`;

const request = async (url, options) => {
  const response = await fetch(url, options);
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || "Staff request failed.");
  return result.data;
};

/**
 * ==============================================
 * STAFF API
 * ==============================================
 */

export const getStaff = async () => {
  return request(BASE_URL);
};

export const getStaffById = async (id) => {
  return request(`${BASE_URL}/${id}`);
};

export const createStaff = async (staff) => {
  return request(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(staff),
  });

};

export const updateStaff = async (id, staff) => {
  return request(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(staff),
  });

};

export const deleteStaff = async (id) => {
  await request(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  return true;
};

export const getStaffByRole = async (role) => {
  const response = await fetch(`${BASE_URL}/role/${role}`);

  if (!response.ok) {
    throw new Error("Failed to retrieve staff.");
  }

  const result = await response.json();

  return result.data;
};

export const getStaffByBranch = async (branchId) => {
  const response = await fetch(`${BASE_URL}/branch/${branchId}`);

  if (!response.ok) {
    throw new Error("Failed to retrieve staff.");
  }

  const result = await response.json();

  return result.data;
};
