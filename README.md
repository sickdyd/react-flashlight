![travis](https://travis-ci.com/sickdyd/react-flashlight.svg?branch=master)

## `<ReactFlashlight>`

A `<ReactFlashlight>` adds a flashlight effect to an element.

[Click here to see a demo](https://sickdyd.github.io/react-flashlight-demo/).

[Demo source](https://github.com/sickdyd/react-flashlight-demo/blob/master/src/App.js).

### Installing

```bash
$ npm install react-flashlight
```

### Exports

The default export is `<ReactFlashlight>`.
To use it:

```js
import { ReactFlashlight } from 'react-flashlight';
```

### React Search Autocomplete Usage

```js
import React from "react";
import { ReactFlashlight } from "react-flashlight";
import logo from "./logo.svg";
import './App.css';
 
const style = {
  backgroundImage: `url(${logo})`,
  height: "90vh",
  width: "90vw",
} 
 
function App() {
  
  return (
    <div className="App">
      <header className="App-header"> 
        <ReactFlashlight>
          <div style={style}>
            Hello, I am a child element.
          </div>
        </ReactFlashlight>
      </header>
    </div> 
  ); 
}

export default App;
```

#### `<ReactFlashlight>` Props:

  children: <div></div>,
  showCursor: false,
  initialSize: 50,
  initialPosition: {x: 0, y: 0},
  moveTo: null,
  speed: 1000,
  contain: true,
  enableMouse: true,
  wheelResize: true,
  darkness: 0.9,

```js
//
// Props:
//
{
  // Provide a child to which apply the effect
  // Accepts only one child, defaults to <div></div>
  children
  // Show or hide the cursor, defaults to false
  showCursor
  // Set initial light size, defaults to 50px
  initialSize
  // Set initial position, defaults to 0, 0
  initialPosition
  // Move programmatically the light to a location {x: value, y: value}
  moveTo
  // The speed of the movement transition, defaults to 1000ms
  speed
  // If true, the light won't be able to move out of the container
  contain
  // Let the user control the light with the mouse, defaults to true
  enableMouse
  // Allow the user to resize the light with the mouse wheel, defaults to true
  wheelResize
  // The "room" darkness (opacity), defaults to 0.9
  darkness
}
```
----

### License

MIT
