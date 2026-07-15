const BASE_URL = "http://localhost:3000/api/staff";

/**
 * ==============================================
 * STAFF API
 * ==============================================
 */

export const getStaff = async () => {
  const response = await fetch(BASE_URL);

  if (!response.ok) {
    throw new Error("Failed to retrieve staff.");
  }

  const result = await response.json();

  return result.data;
};

export const getStaffById = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to retrieve staff.");
  }

  const result = await response.json();

  return result.data;
};

export const createStaff = async (staff) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(staff),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result.data;
};

export const updateStaff = async (id, staff) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(staff),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result.data;
};

export const deleteStaff = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

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
