import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EnhanceButton } from "./EnhanceButton";

const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => vi.clearAllMocks());

function makeStreamResponse(text: string) {
  const encoder = new TextEncoder();
  const chunks = text.split("").map((c) =>
    encoder.encode(
      `data: ${JSON.stringify({ type: "content_block_delta", delta: { type: "text_delta", text: c } })}\n\n`
    )
  );
  let i = 0;
  return {
    ok: true,
    body: {
      getReader: () => ({
        read: vi.fn().mockImplementation(async () => {
          if (i < chunks.length) return { done: false, value: chunks[i++] };
          return { done: true, value: undefined };
        }),
      }),
    },
  };
}

describe("EnhanceButton", () => {
  it("renders the enhance button", () => {
    render(<EnhanceButton field="summary" content="engineer" onResult={vi.fn()} />);
    expect(screen.getByRole("button", { name: /enhance/i })).toBeInTheDocument();
  });

  it("shows loading state while streaming", async () => {
    mockFetch.mockResolvedValueOnce(makeStreamResponse("improved text"));

    const { rerender } = render(
      <EnhanceButton field="summary" content="engineer" onResult={vi.fn()} />
    );
    await userEvent.click(screen.getByRole("button", { name: /enhance/i }));

    rerender(<EnhanceButton field="summary" content="engineer" onResult={vi.fn()} />);
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/ai/enhance",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("calls onResult with streamed text", async () => {
    mockFetch.mockResolvedValueOnce(makeStreamResponse("improved"));
    const onResult = vi.fn();

    render(<EnhanceButton field="summary" content="engineer" onResult={onResult} />);
    await userEvent.click(screen.getByRole("button", { name: /enhance/i }));

    await vi.waitFor(() => {
      expect(onResult).toHaveBeenCalled();
    });
  });

  it("shows error message when request fails", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });

    render(<EnhanceButton field="summary" content="engineer" onResult={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: /enhance/i }));

    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });
});
