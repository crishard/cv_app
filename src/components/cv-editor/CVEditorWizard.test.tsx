import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CVEditorWizard } from "./CVEditorWizard";
import { EMPTY_CV_DATA } from "@/types/cv";

const defaultProps = {
  cvId: "cv-1",
  templateId: "modern" as const,
  initialData: EMPTY_CV_DATA,
  onSave: vi.fn(),
};

describe("CVEditorWizard", () => {
  it("starts on step 1 (Personal Info)", () => {
    render(<CVEditorWizard {...defaultProps} />);
    expect(screen.getByRole("heading", { name: /personal info/i })).toBeInTheDocument();
  });

  it("renders a progress indicator with 5 steps", () => {
    render(<CVEditorWizard {...defaultProps} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(5);
  });

  it("does not show a Back button on step 1", () => {
    render(<CVEditorWizard {...defaultProps} />);
    expect(screen.queryByRole("button", { name: /back/i })).not.toBeInTheDocument();
  });

  it("advances to step 2 when required fields are filled and Next is clicked", async () => {
    render(<CVEditorWizard {...defaultProps} />);

    await userEvent.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await userEvent.type(screen.getByLabelText(/email/i), "jane@test.com");
    await userEvent.type(screen.getByLabelText(/phone/i), "+1 555 000");
    await userEvent.type(screen.getByLabelText(/location/i), "NY");

    await userEvent.click(screen.getByRole("button", { name: /next/i }));

    expect(screen.getByRole("heading", { name: /experience/i })).toBeInTheDocument();
  });

  it("shows a validation error when required fields are empty", async () => {
    render(<CVEditorWizard {...defaultProps} />);
    await userEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("shows a Back button from step 2 onwards", async () => {
    render(<CVEditorWizard {...defaultProps} />);

    await userEvent.type(screen.getByLabelText(/full name/i), "Jane");
    await userEvent.type(screen.getByLabelText(/email/i), "jane@test.com");
    await userEvent.type(screen.getByLabelText(/phone/i), "+1 555");
    await userEvent.type(screen.getByLabelText(/location/i), "NY");
    await userEvent.click(screen.getByRole("button", { name: /next/i }));

    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
  });
});
