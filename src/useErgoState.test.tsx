import { render, fireEvent } from "@testing-library/react";
import { it, expect, describe } from "vitest";
import { useErgoState, useState } from "./useErgoState";

describe("useErgoState", () => {
  it("rerenders as the state is updated, but never more than the traditional useState hook would", () => {
    let renderCount = 0;
    const Test = () => {
      renderCount++;
      const count = useErgoState(0);
      return (
        <>
          <div data-testid="count">Count is {count()}</div>
          <button onClick={() => count(count() + 1)}>Increment</button>
        </>
      );
    };
    const page = render(<Test />);
    const button = page.getByRole("button");
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    expect(renderCount).toBe(4);
    expect(page.getByTestId("count").innerHTML).toBe("Count is 3");
    page.unmount();
  });

  it("acts the same when passing a function as a setter", () => {
    let renderCount = 0;
    const Test = () => {
      renderCount++;
      const count = useState(0);
      return (
        <>
          <div data-testid="count">Count is {count()}</div>
          <button onClick={() => count(count => count + 1)}>Increment</button>
        </>
      );
    };
    const page = render(<Test />);
    const button = page.getByRole("button");
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    expect(renderCount).toBe(4);
    expect(page.getByTestId("count").innerHTML).toBe("Count is 3");
    page.unmount();
  });
});
