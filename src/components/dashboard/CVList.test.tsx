import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CVList } from "./CVList";

const mockCVs = [
  {
    id: "cv-1",
    title: "Software Engineer CV",
    status: "DRAFT" as const,
    atsScore: 72,
    templateId: "modern",
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "cv-2",
    title: "Product Manager CV",
    status: "COMPLETE" as const,
    atsScore: null,
    templateId: "classic",
    updatedAt: new Date("2024-01-10"),
  },
];

describe("CVList", () => {
  it("renders a list of CVs", () => {
    render(<CVList cvs={mockCVs} />);
    expect(screen.getByText("Software Engineer CV")).toBeInTheDocument();
    expect(screen.getByText("Product Manager CV")).toBeInTheDocument();
  });

  it("shows ATS score when available", () => {
    render(<CVList cvs={mockCVs} />);
    expect(screen.getByText("72")).toBeInTheDocument();
  });

  it("shows empty state when no CVs exist", () => {
    render(<CVList cvs={[]} />);
    expect(screen.getByText(/no cvs yet/i)).toBeInTheDocument();
  });

  it("renders edit links for each CV", () => {
    render(<CVList cvs={mockCVs} />);
    const links = screen.getAllByRole("link", { name: /edit/i });
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "/cv/cv-1/edit");
  });
});
