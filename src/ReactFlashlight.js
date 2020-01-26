import React from "react";
import PropTypes from "prop-types";

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
    background: "radial-gradient(transparent 0%, rgba(0, 0, 0, " + darkness + ") " + initialSize + "%, rgba(0, 0, 0, " + (darkness + 0.1) + ") 80%)",
    cursor: showCursor ? "default" : "none",
    transition: "none"
  }

  const lightRef = React.useRef();
  const containerRef = React.useRef();

  React.useEffect(()=>{

    let size = initialSize;
    
    const light = lightRef.current;
    const container = containerRef.current;
    container.style.overflow = "hidden";
    container.style.position = "relative";

    const containerStyle = container.getBoundingClientRect();

    const maskSize = parseInt(containerStyle.width) > parseInt(containerStyle.height)
      ? parseInt(containerStyle.width)
      : parseInt(containerStyle.height);

    light.style.width = maskSize * 2 + "px";
    light.style.height = maskSize * 2 + "px";

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
      if (event.deltaY < 0) {
        size += 1;
      } else if (event.deltaY > 0) {
        if (size > 0) size -= 1;
      }
      light.style.background = "radial-gradient(transparent 0%, rgba(0, 0, 0, " + darkness + ") " + size + "%, rgba(0, 0, 0, " + (darkness + 0.1) + ") " + (100 - size) + "%)";
    }

    enableMouse && container.addEventListener("mousemove", handleMouseMove);
    wheelResize && container.addEventListener("wheel", handleWheel);

    return ()=>{
      wheelResize && container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("wheel", handleWheel)
    }

  }, []);

  React.useEffect(()=>{

    if (moveTo) {
      const light = lightRef.current;
      const container = containerRef.current;
  
      light.style.transition = "all ease-in-out " + speed + "ms";
  
      const lightStyle = window.getComputedStyle(light, null);
      const containerStyle = container.getBoundingClientRect();
  
      if (moveTo.x > containerStyle.width) moveTo.x = containerStyle.width;
      if (moveTo.y > containerStyle.height) moveTo.y = containerStyle.height;
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