import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TemplateGallery } from "./TemplateGallery";

describe("TemplateGallery", () => {
  it("renders all 3 templates", () => {
    render(<TemplateGallery selected={null} onSelect={vi.fn()} />);
    expect(screen.getByText("Modern")).toBeInTheDocument();
    expect(screen.getByText("Classic")).toBeInTheDocument();
    expect(screen.getByText("Minimal")).toBeInTheDocument();
  });

  it("calls onSelect with the template id when a card is clicked", async () => {
    const onSelect = vi.fn();
    render(<TemplateGallery selected={null} onSelect={onSelect} />);
    await userEvent.click(screen.getByText("Modern"));
    expect(onSelect).toHaveBeenCalledWith("modern");
  });

  it("marks the selected template visually", () => {
    render(<TemplateGallery selected="classic" onSelect={vi.fn()} />);
    const classic = screen.getByTestId("template-card-classic");
    expect(classic).toHaveAttribute("aria-selected", "true");
  });

  it("shows template description", () => {
    render(<TemplateGallery selected={null} onSelect={vi.fn()} />);
    expect(screen.getByText(/maximizes ats readability/i)).toBeInTheDocument();
  });
});
