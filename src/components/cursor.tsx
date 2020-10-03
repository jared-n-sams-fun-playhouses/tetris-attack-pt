import React, { useState, useEffect } from 'react';

type Position = {
  x:number;
  y:number;
}

interface Props {
  columns:number;
  rows:number;
  player:string;
  move: (position:Position) => void;
  raise:() => void;
  swap:(x:number, y:number) => void;
}

interface CursorEvent extends React.KeyboardEvent<HTMLDivElement> {
  key:"ArrowLeft" | "ArrowUp" | "ArrowRight" | "ArrowDown" | "Shift" | " "
}

export default (props:Props) => {
  const [position, setPosition] = useState({x: 0, y: 0});

  useEffect(() => {
    // TODO, think about adding position state update here on component change
    // setPosition({x: props.x, y: props.y})

    //TODO: sort out these keyDown events
    //@ts-ignore
    window.addEventListener('keydown', keyDown);

    return function cleanup() {
          //@ts-ignore
      window.removeEventListener('keydown', keyDown);
    };
  });

  function keyDown(event: CursorEvent)  {
    console.log({ event });
    let x = position.x;
    let y = position.y;
    let move = false;

    const action = {
      ArrowLeft: () => { x--; move = true; },
      ArrowUp: () => { y--; move = true; },
      ArrowRight: () => { x++; move = true; },
      ArrowDown: () => { y++; move = true; },
      Shift: () => { props.raise(); },
      ' ': () => { props.swap(x, y); },
    }[event.key];

    action();

    if (move) {
      // for x max comparison, need to account for the second cursor on the right, - 1
      if (x < 0 || x >= props.columns - 1 || y < 0 || y >= props.rows)
        return;

      const position = { x: x, y: y };
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
