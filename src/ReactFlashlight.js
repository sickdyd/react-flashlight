import React from "react";
import PropTypes from "prop-types";
import ResizeObserver from 'resize-observer-polyfill';

/**
 * 
 * @param {HTMLElement} children The component's children
 * @param {bool} showCursor If true, shows the cursor
 * @param {number} initialSize the initial size of the light
 * @param {object} initialPosition An object {x: value, y: value} defining the initial position
 * @param {bool} enableMouse If true, the user can control the light with its mouse
 * @param {object} moveTo An object {x: value, y: value} defining the location to where the light will be moved
 * @param {number} speed Defines the transition speed of the movement of the light
 * @param {bool} wheelResize If true, allows the user to resize the light with the mouse wheel
 * @param {number} darkness Defines how dark is the "room"
 */

export default function ReactFlashlight(props) {

  const {
    children,
    showCursor,
    initialSize,
    initialPosition,
    enableMouse,
    moveTo,
    speed,
    wheelResize,
    darkness,
  } = props;

  const lightStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    // To control the size of the light, simply use a percentage on the background creating the effect - init with initialSize
    background: "radial-gradient(transparent 0%, rgba(0, 0, 0, " + darkness + ") " + initialSize + "%, rgba(0, 0, 0, " + (darkness + 0.1) + ") 80%)",
    cursor: showCursor ? "default" : "none",
    transition: "none"
  }

  const lightRef = React.useRef();
  const containerRef = React.useRef();

  /**
   * Here I add event handlers for wheel, mouseMove and resize
   */

  React.useEffect(()=>{

    let size = initialSize;
    
    const light = lightRef.current;
    const container = containerRef.current;
    container.style.overflow = "hidden";
    container.style.position = "relative";

    // This function resizes the light, and it's called when the component mount and if the window resizes

    function resizeLight() {
      const containerStyle = container.getBoundingClientRect();

      const maskSize = parseInt(containerStyle.width) > parseInt(containerStyle.height)
        ? parseInt(containerStyle.width)
        : parseInt(containerStyle.height);
  
      light.style.width = maskSize * 2 + "px";
      light.style.height = maskSize * 2 + "px";
    }

    resizeLight();

    const lightStyle = window.getComputedStyle(light, null);

    light.style.left = initialPosition.x - parseInt(lightStyle.width) / 2 + "px";
    light.style.top = initialPosition.y - parseInt(lightStyle.height) / 2 + "px";

    function handleMouseMove(e) {
      const lightStyle = window.getComputedStyle(light, null);
      const containerStyle = container.getBoundingClientRect();
      light.style.transition = "none";
      light.style.top = e.clientY - containerStyle.top - parseInt(lightStyle.height) / 2 + "px";
      light.style.left = e.clientX - containerStyle.left - parseInt(lightStyle.width) / 2 + "px";
    }

    function handleWheel(e) {
      e.preventDefault();
      if (e.deltaY < 0) {
        size += 1;
      } else if (e.deltaY > 0) {
        if (size > 0) size -= 1;
      }
      light.style.background = "radial-gradient(transparent 0%, rgba(0, 0, 0, " + darkness + ") " + size + "%, rgba(0, 0, 0, " + (darkness + 0.1) + ") " + (100 - size) + "%)";
    }

    const resizeObserver = new ResizeObserver(entries => {
      resizeLight();
    });

    resizeObserver.observe(container);

    enableMouse && container.addEventListener("mousemove", handleMouseMove);
    wheelResize && container.addEventListener("wheel", handleWheel);

    // Cleanup
    return ()=>{
      wheelResize && container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("wheel", handleWheel);
      resizeObserver.unobserve(container);
      resizeObserver.disconnect();
    }

  }, []);

  /**
   * This is executed when moveTo props change
   */

  React.useEffect(()=>{

    if (moveTo) {
      const light = lightRef.current;
      const container = containerRef.current;
  
      light.style.transition = "all ease-in-out " + speed + "ms";
  
      const lightStyle = window.getComputedStyle(light, null);
      const containerStyle = window.getComputedStyle(container, null); //container.getBoundingClientRect();

      if (moveTo.x > parseInt(containerStyle.width)) moveTo.x = parseInt(containerStyle.width);
      if (moveTo.y > parseInt(containerStyle.height)) moveTo.y = parseInt(containerStyle.height);
      if (moveTo.x < 0) moveTo.x = 0;
      if (moveTo.y < 0) moveTo.y = 0;
  
      light.style.top = moveTo.y - parseInt(lightStyle.height) / 2 + "px";
      light.style.left = moveTo.x - parseInt(lightStyle.width) / 2 + "px";
    }
  }, [moveTo])

  return ( 
    React.Children.map(children, child =>
      React.cloneElement(child,
        {
          ref: containerRef,
          children:
            <>
              <div
                data-testid="react-flashlight"
                style={lightStyle}
                ref={lightRef}
              />
              {child.props.children}
            </>
        })
    )
  )
}

ReactFlashlight.propTypes = {
  children: PropTypes.element,
  showCursor: PropTypes.bool,
  initialSize: PropTypes.number,
  initialPosition: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  enableMouse: PropTypes.bool,
  moveTo: PropTypes.object,
  speed: PropTypes.number,
  wheelResize: PropTypes.bool,
  darkness: PropTypes.number,
}

ReactFlashlight.defaultProps = {
  children: <div></div>,
  showCursor: false,
  initialSize: 10,
  initialPosition: {x: 0, y: 0},
  enableMouse: true,
  moveTo: null,
  speed: 1000,
  wheelResize: false,
  darkness: 0.9,
} 