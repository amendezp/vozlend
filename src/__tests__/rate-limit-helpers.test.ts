import { describe, it, expect } from "vitest";
import { getClientIP } from "@/lib/rate-limit";

describe("getClientIP", () => {
  it("extracts IP from x-forwarded-for header", () => {
    const headers = new Headers({
      "x-forwarded-for": "203.0.113.195, 70.41.3.18, 150.172.238.178",
    });
    expect(getClientIP(headers)).toBe("203.0.113.195");
  });

  it("falls back to x-real-ip", () => {
    const headers = new Headers({
      "x-real-ip": "198.51.100.42",
    });
    expect(getClientIP(headers)).toBe("198.51.100.42");
  });

  it("returns 'unknown' when no IP headers present", () => {
    const headers = new Headers();
    expect(getClientIP(headers)).toBe("unknown");
  });

  it("prefers x-forwarded-for over x-real-ip", () => {
    const headers = new Headers({
      "x-forwarded-for": "203.0.113.195",
      "x-real-ip": "198.51.100.42",
    });
    expect(getClientIP(headers)).toBe("203.0.113.195");
  });

  it("handles single IP in x-forwarded-for", () => {
    const headers = new Headers({
      "x-forwarded-for": "192.168.1.1",
    });
    expect(getClientIP(headers)).toBe("192.168.1.1");
  });
});
