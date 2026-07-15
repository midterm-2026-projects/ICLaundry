const BASE_URL = "http://localhost:3000/api/branches";

/**
 * ==============================================
 * BRANCH API
 * ==============================================
 */

export const getBranches = async () => {
  const response = await fetch(BASE_URL);

  if (!response.ok) {
    throw new Error("Failed to retrieve branches.");
  }

  const result = await response.json();

  return result.data;
};

export const getBranchById = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to retrieve branch.");
  }

  const result = await response.json();

  return result.data;
};
