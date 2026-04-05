import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./LoginForm";

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

import { signIn } from "next-auth/react";

const mockSignIn = vi.mocked(signIn);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("LoginForm", () => {
  it("renders email and password fields", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("shows an error message on invalid credentials", async () => {
    mockSignIn.mockResolvedValueOnce({ error: "CredentialsSignin" } as never);

    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText("Email"), "wrong@test.com");
    await userEvent.type(screen.getByLabelText("Password"), "wrongpass");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Invalid email or password"
    );
  });

  it("calls signIn with credentials on submit", async () => {
    mockSignIn.mockResolvedValueOnce({ error: null } as never);

    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText("Email"), "user@test.com");
    await userEvent.type(screen.getByLabelText("Password"), "password123");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(mockSignIn).toHaveBeenCalledWith("credentials", expect.objectContaining({
      email: "user@test.com",
      password: "password123",
      redirect: false,
    }));
  });
});
