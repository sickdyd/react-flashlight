import React from "react";
import "@babel/polyfill";
import { fireEvent, cleanup, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ReactFlashlight from "../ReactFlashlight";

afterEach(cleanup);

describe("<ReactFlashlight>", ()=> { 

  test("Renders the flashlight", () => {
    const {getByTestId} = render(<ReactFlashlight />);
    const light = getByTestId("react-flashlight");
    expect(light).toBeInTheDocument();
  });

  test("Renders component children", () => {
    const {getByTestId} = render(<ReactFlashlight><div data-testid="child"></div></ReactFlashlight>);
    const child = getByTestId("child");
    expect(child).toBeInTheDocument();
  });

  test("If showCursor is false hide cursor (default)", () => {
    const {getByTestId} = render(
      <ReactFlashlight>
        <div data-testid="child"></div>
      </ReactFlashlight>);
    const child = getByTestId("child");
    const style = window.getComputedStyle(child);
    expect(style.cursor).toBe("none");
  });

  test("If showCursor is true show cursor", () => {
    const {getByTestId} = render(
      <ReactFlashlight showCursor={true}>
        <div data-testid="child"></div>
      </ReactFlashlight>);
    const child = getByTestId("child");
    const style = window.getComputedStyle(child);
    expect(style.cursor).toBe("default");
  });

  test("If enableMouse is true move the light on mouseMove (default)", () => {
    const {getByTestId} = render(
      <ReactFlashlight>
        <div data-testid="child"></div>
      </ReactFlashlight>
    );
    const light = getByTestId("react-flashlight");
    const child = getByTestId("child");
    fireEvent.mouseMove(child, { clientX: 100, clientY: 200 });
    const style = window.getComputedStyle(light);
    expect(style.left).toBe("100px");
    expect(style.top).toBe("200px");
  });

  test("If enableMouse is false nothing happens on mouseMove", () => {
    const {getByTestId} = render(
      <ReactFlashlight enableMouse={false}>
        <div data-testid="child"></div>
      </ReactFlashlight>
    );
    const light = getByTestId("react-flashlight");
    const child = getByTestId("child");
    fireEvent.mouseMove(child, { clientX: 100, clientY: 200 });
    const style = window.getComputedStyle(light);
    expect(style.left).toBe("0px");
    expect(style.top).toBe("0px");
  });

  test("Change light position with props moveTo", () => {
    const {getByTestId} = render(
      <ReactFlashlight moveTo={{x: 100, y: 200}}>
        <div style={{width: 500, height: 500}}></div>
      </ReactFlashlight>,
    );
    const light = getByTestId("react-flashlight");
    const style = window.getComputedStyle(light);
    expect(style.top).toBe("200px");
  });

  test("Check for speed default prop", () => {
    const {getByTestId} = render(
      <ReactFlashlight moveTo={{x: 100, y: 200}} />
    );
    const light = getByTestId("react-flashlight");
    expect(light.style.transition).toContain("1000ms");
  });

  test("Change speed prop to 2000ms", () => {
    const {getByTestId} = render(
      <ReactFlashlight speed={2000} moveTo={{x: 100, y: 200}} />
    );
    const light = getByTestId("react-flashlight");
    expect(light.style.transition).toContain("2000ms");
  });

});