import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import IdeaGenerator from "../../../components/Dashboard/IdeaGenerator";

global.fetch = jest.fn();

describe("IdeaGenerator", () => {
  beforeEach(() => fetch.mockClear());

  it("validates empty prompt", async () => {
    render(<IdeaGenerator onNewIdeas={jest.fn()} quota={{ used: 0, limit: 10 }} isPro={false} />);
    fireEvent.click(screen.getByText("Generate"));
    expect(await screen.findByText(/please enter/i)).toBeInTheDocument();
  });

  it("calls onNewIdeas on success", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ideas: "Idea 1\nIdea 2" }),
    });
    const onNewIdeas = jest.fn();
    render(<IdeaGenerator onNewIdeas={onNewIdeas} quota={{ used: 0, limit: 10 }} isPro={false} />);
    fireEvent.change(screen.getByPlaceholderText(/e\.g\./i), { target: { value: "foo" } });
    fireEvent.click(screen.getByText("Generate"));
    await waitFor(() => expect(onNewIdeas).toHaveBeenCalledWith("Idea 1\nIdea 2"));
  });
});