import React from 'react'
import classNames from 'classnames';


export default (props) => {
  const size = {
    width: props.size.width,
    height: props.size.height,
  }

  const class_name = classNames('tile', {cursor: props.cursor});

  return (
    <div
      className={class_name}
      data-type={props.piece_type}
      data-x={props.x}
      data-y={props.y}
      style={size}
    >
        {props.piece_type}
    </div>
  );
};
