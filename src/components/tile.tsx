import React from 'react'
import classNames from 'classnames';
import { PieceType } from './board';

type BoardSize = {
  width:number;
  height:number;
}

interface Props {
  size:BoardSize;
  cursor:boolean;
  pieceType:PieceType;
  x:number;
  y:number;
}

export default (props:Props) => {
  const size = {
    width: props.size.width,
    height: props.size.height,
  }

  const class_name = classNames('tile', {cursor: props.cursor});

  return (
    <div
      className={class_name}
      data-type={props.pieceType}
      data-x={props.x}
      data-y={props.y}
      style={size}
    >
      {props.pieceType}
    </div>
  );
};
