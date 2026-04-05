import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ATSScorePanel } from "./ATSScorePanel";

const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => vi.clearAllMocks());

const mockScore = {
  score: 74,
  breakdown: { keywords: 18, formatting: 22, completeness: 17, impact: 17 },
  suggestions: ["Add more keywords", "Quantify results", "Expand summary"],
};

describe("ATSScorePanel", () => {
  it("renders the analyze button", () => {
    render(<ATSScorePanel cvText="Jane Doe engineer" />);
    expect(screen.getByRole("button", { name: /analyze/i })).toBeInTheDocument();
  });

  it("displays the score after a successful analysis", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockScore,
    });

    render(<ATSScorePanel cvText="Jane Doe engineer" />);
    await userEvent.click(screen.getByRole("button", { name: /analyze/i }));

    expect(await screen.findByText("74")).toBeInTheDocument();
    expect(screen.getByText(/100/)).toBeInTheDocument();
  });

  it("displays improvement suggestions", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockScore,
    });

    render(<ATSScorePanel cvText="Jane Doe engineer" />);
    await userEvent.click(screen.getByRole("button", { name: /analyze/i }));

    expect(await screen.findByText("Add more keywords")).toBeInTheDocument();
    expect(screen.getByText("Quantify results")).toBeInTheDocument();
  });

  it("shows error when analysis fails", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });

    render(<ATSScorePanel cvText="Jane Doe engineer" />);
    await userEvent.click(screen.getByRole("button", { name: /analyze/i }));

    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });
});
