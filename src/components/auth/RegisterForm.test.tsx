import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegisterForm } from "./RegisterForm";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("RegisterForm", () => {
  it("renders name, email and password fields", () => {
    render(<RegisterForm />);
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("shows server error when registration fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Email already in use" }),
    });

    render(<RegisterForm />);
    await userEvent.type(screen.getByLabelText("Name"), "John");
    await userEvent.type(screen.getByLabelText("Email"), "john@test.com");
    await userEvent.type(screen.getByLabelText("Password"), "password123");
    await userEvent.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Email already in use");
  });

  it("submits correct payload to the register endpoint", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    render(<RegisterForm />);
    await userEvent.type(screen.getByLabelText("Name"), "John");
    await userEvent.type(screen.getByLabelText("Email"), "john@test.com");
    await userEvent.type(screen.getByLabelText("Password"), "password123");
    await userEvent.click(screen.getByRole("button", { name: /create account/i }));

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/auth/register",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ name: "John", email: "john@test.com", password: "password123" }),
      })
    );
  });
});
