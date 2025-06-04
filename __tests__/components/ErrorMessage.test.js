import { render, screen } from "@testing-library/react";
import ErrorMessage from "../../components/ErrorMessage";

describe("ErrorMessage", () => {
  it("renders error message when provided", () => {
    render(<ErrorMessage message="Oops!" />);
    expect(screen.getByText("Oops!")).toBeInTheDocument();
  });
  it("renders nothing if message is empty", () => {
    const { container } = render(<ErrorMessage message="" />);
    expect(container).toBeEmptyDOMElement();
  });
});