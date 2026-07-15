import { describe, it, expect } from "vitest";
import { supabase } from "../../config/db.js";

describe("Validate Supabase database connection", () => {
  it("should successfully connect to the database", async () => {
    const { data, error } = await supabase.from("orders").select("*").limit(1);

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBe(true);
  });
});
