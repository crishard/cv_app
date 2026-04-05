import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ModernTemplate } from "./ModernTemplate";
import { ClassicTemplate } from "./ClassicTemplate";
import { MinimalTemplate } from "./MinimalTemplate";
import { mockCVData } from "./fixtures";

const templates = [
  { name: "ModernTemplate", Component: ModernTemplate },
  { name: "ClassicTemplate", Component: ClassicTemplate },
  { name: "MinimalTemplate", Component: MinimalTemplate },
];

describe.each(templates)("$name", ({ Component }) => {
  it("renders the candidate full name", () => {
    render(<Component data={mockCVData} />);
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("renders contact information", () => {
    render(<Component data={mockCVData} />);
    expect(screen.getByText(/jane@example\.com/)).toBeInTheDocument();
    expect(screen.getByText(/San Francisco/)).toBeInTheDocument();
  });

  it("renders the professional summary", () => {
    render(<Component data={mockCVData} />);
    expect(screen.getByText(/8 years of experience/i)).toBeInTheDocument();
  });

  it("renders experience entries", () => {
    render(<Component data={mockCVData} />);
    expect(screen.getByText("Senior Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
  });

  it("renders education entries", () => {
    render(<Component data={mockCVData} />);
    expect(screen.getByText("MIT")).toBeInTheDocument();
  });

  it("renders technical skills", () => {
    render(<Component data={mockCVData} />);
    expect(screen.getByText(/TypeScript/)).toBeInTheDocument();
    expect(screen.getByText(/Node\.js/)).toBeInTheDocument();
  });
});
