import React from "react";
import Tile from "./tile";
import Cursor from "./cursor";
import { randomInteger } from "../utils/utils";


export default class Board extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      player: props.player,
      columns: props.columns || 6,
      rows: props.rows || 12,
      board: [],
      cursor: {
        x: 0,
        y: 0,
      },
    };
  }

  componentDidMount() {
    this.setState({board: this.buildBoard(this.state.columns, this.state.rows)});
  }

  getPieceType(piece) {
    return ["👻", "😂", "🔥", "😺", "🌮"][piece];
  }

  buildBoard(x, y) {
    var size = x * y;
    var board = new Array(size);
    var id_num = 0;

    // build empty upper slots
    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < x; j++) {
        board[id_num] = {
          piece_type: `[]`,
          pos_x: j,
          pos_y: i,
        };
        id_num++;
      }
    }

    console.log("initial board", { board });
    // build actual blocks
    // FIXME
    // the board should be build with no matches
    for (var i = 6; i < y; i++) {
      for (var j = 0; j < x; j++) {
        board[id_num] = {
          piece_type: this.getPieceType(randomInteger(0, 4)),
          pos_x: j,
          pos_y: i,
        };
        id_num++;
      }
    }
    console.log("final board", { board });
    return board;
  }

  buildRow() {
    let row;
    for (var j = 0; j < 6; j++) {
      console.log(row);
      row = [
        ...(row || []),
        {
          piece_type: this.getPieceType(randomInteger(0, 4)),
          pos_x: j,
          pos_y: this.state.board[this.state.board.length - 1].pos_y + 1,
        },
      ];
    }
    return row;
  }

  swapTiles(x, y) {
    // debug performance
    var t0 = performance.now();

    var tiles = this.state.board;
    var tilesToSwap = tiles.filter(function (tile) {
      return (
        (tile.pos_x == x || tile.pos_x == x + 1) &&
        tile.pos_y == y &&
        tile.piece_type
      );
    });

    if (tilesToSwap.length != 2) return;

    // given what the MDN docs says about Array.prototype.filter() is incorrect,
    // it seems to pass a slice of the array it's filtering,
    // thus mutating the array that's being filtered
    var tmp = tilesToSwap[1].piece_type;
    tilesToSwap[1].piece_type = tilesToSwap[0].piece_type;
    tilesToSwap[0].piece_type = tmp;

    this.setState({board: tiles});

    // debug performance
    var t1 = performance.now();
    console.log("swapTiles t: " + (t1 - t0) + "ms");

    // debug
    // console.log(this.state.player, x, y, tilesToSwap[1], tilesToSwap[0]);
    this.searchForMatch();
  }

  searchForMatch() {
    const { board } = this.state;
    // search x
    let pieceTrain = [];
    board.forEach((tile, index) => {
      if(index+1 % 6 === 0 ) {
        console.log("NEW ROW")
        pieceTrain = [tile.piece_type];
      }
      if(tile.piece_type === "[]") return pieceTrain = [];
      if(pieceTrain.length >= 3 && !pieceTrain.includes(tile.piece_type)){

        const newBoard = [...board]

        // FIXME
        // there's a bug when matching pieces when the edge is the same,
        // it would consider 2 pieces next to each other a match
        // 
        // FIXME 2
        // One matches 3 in a row
        for(let x = index-3; x < index; x++){
            newBoard.splice(x, 1, {piece_type:"[]", pos_x:board[x].pos_x, pos_y:board[x].pos_y});
        }

        console.log(newBoard, board)
        this.setState({board:newBoard})
      } 
      if(!pieceTrain.length) return pieceTrain = [tile.piece_type]
      if(pieceTrain.includes(tile.piece_type)) return pieceTrain = [...pieceTrain, tile.piece_type]
      console.log("nope", pieceTrain, tile)
      return pieceTrain = [tile.piece_type];
    });

    //TODO: search vertical matches
    board.forEach((tile) => {
    //   console.log(tile);
    });
  }

  raiseBoard() {
    // FIXME, cursor need to stay on the last relative board/grid position
    const newRow = this.buildRow();
    const board = [...this.state.board, ...newRow];
    const firstRow = [0, 1, 2, 3, 4, 5];
    while (firstRow.length) {
      board.splice(firstRow.pop(), 1);
    }

    this.setState({board});
  }

  moveCursor(cursor) {
    this.setState({cursor});
  }

  render() {
    const tile_size = {width:64, height: 64};
    const board_size = 0;

    const tiles = this.state.board.map((tile, index) => {
      const x = this.state.cursor.x;
      const y = this.state.cursor.y;
      let setCursor = false;

      if ((tile.pos_x == x || tile.pos_x == x + 1) && tile.pos_y == y) {
        setCursor = true;
      }

      return (
        <Tile
          key={index}
          piece_type={tile.piece_type}
          x={tile.pos_x}
          y={tile.pos_y}
          size={tile_size}
          cursor={setCursor}
        />
      );
    });

    return (
      <div>
        <Cursor
          player={this.state.player}
          columns={this.state.columns}
          rows={this.state.rows}
          move={this.moveCursor.bind(this)}
          swap={this.swapTiles.bind(this)}
          raise={this.raiseBoard.bind(this)}
        />

        <div
          id="board"
          data-player={this.state.player}
          data-columns={this.state.columns}
          data-rows={this.state.rows}
          size={board_size}
        >
          {tiles}
        </div>
      </div>
    );
  }
};
