import { render, screen } from "@testing-library/react";
import ErrorMessage from "./ErrorMessage";

describe("ErrorMessage", () => {
  it("renders error message when message prop is provided", () => {
    render(<ErrorMessage message="Something went wrong!" />);
    expect(screen.getByText("Something went wrong!")).toBeInTheDocument();
  });

  it("does not render anything when message prop is empty", () => {
    const { container } = render(<ErrorMessage message="" />);
    expect(container).toBeEmptyDOMElement();
  });
});