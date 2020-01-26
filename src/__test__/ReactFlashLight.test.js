import React from "react";
import "@babel/polyfill";
import { fireEvent, cleanup, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ReactFlashlight from "../ReactFlashlight";

/* children,
showCursor,
initialSize,
enableMouse,
moveTo,
speed,
wheelResize, */

afterEach(cleanup);

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe("<ReactFlashlight>", ()=> { 

  test("Renders the flashlight", () => {
    const {getByTestId} = render(<ReactFlashlight />);
    const light = getByTestId("react-flashlight");
    expect(light).toBeInTheDocument();
  });

  test("Renders children", () => {
    const {getByTestId} = render(<ReactFlashlight><div data-testid="child"></div></ReactFlashlight>);
    const child = getByTestId("child");
    expect(child).toBeInTheDocument();
  });

  test("Hides cursor by default", () => {
    const {getByTestId} = render(<ReactFlashlight />);
    const light = getByTestId("react-flashlight");
    const style = window.getComputedStyle(light);
    expect(light).toBeInTheDocument();
    expect(style.cursor).toBe("none");
  });

  test("Shows cursor if showCursor is true", () => {
    const {getByTestId} = render(<ReactFlashlight showCursor={true} />);
    const light = getByTestId("react-flashlight");
    const style = window.getComputedStyle(light);
    expect(style.cursor).toBe("default");
  });

  test("By default change position on mouseMove", () => {
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

  test("Change position with props moveTo", async () => {
    const {getByTestId} = render(
      <ReactFlashlight
        moveTo={{x: 100, y: 200}}
      >
        <div
          style={{width: 500, height: 500}}
          data-testid="child"
        >  
        </div>
      </ReactFlashlight>
    );
    const light = getByTestId("react-flashlight");
    const child = getByTestId("child");
    const style = window.getComputedStyle(light);
    const childStyle = window.getComputedStyle(child);
    
    await delay(2000);
    expect(childStyle.width).toBe("500px");
    expect(style.top).toBe("200px");
  });

});