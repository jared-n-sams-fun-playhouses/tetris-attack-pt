import React, { useState, useEffect } from 'react';


export default (props) => {
  const [position, setPosition] = useState({x: 0, y: 0});

  useEffect(() => {
    // TODO, think about adding position state update here on component change
    // setPosition({x: props.x, y: props.y})

    window.addEventListener('keydown', keyDown);

    return function cleanup() {
      window.removeEventListener('keydown', keyDown);
    };
  });

  const keyDown = (event) => {
    console.log(event);
    let x = position.x;
    let y = position.y;
    let move = false;

    const action = {
      ArrowLeft:  () => { x--; move = true; },
      ArrowUp:    () => { y--; move = true; },
      ArrowRight: () => { x++; move = true; },
      ArrowDown:  () => { y++; move = true; },
      Shift:      () => { props.raise(); },
      ' ':        () => { props.swap(x, y); },
    }[event.key];

    action()

    if(move) {
      // for x max comparison, need to account for the second cursor on the right, - 1
      if(x < 0 || x >= props.columns - 1 || y < 0 || y >= props.rows)
        return;

      const position = {x:x, y:y};
      props.move(position);
      setPosition(position);
    }

    // debug
    console.log(props.player, x, y);
  }

  return (
    <div id={props.player} data-x={position.x} data-y={position.y}></div>
  );
};
