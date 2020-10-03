import React from 'react'
import Board from './board';


export default (props) => {
  return (
    <div id="main">
      <Board
        player="1"
        columns={6}
        rows={12}
      />
    </div>
  );
};
