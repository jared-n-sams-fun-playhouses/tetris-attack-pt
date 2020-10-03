import React from "react";
import Tile from "./tile";
import Cursor from "./cursor";
import { randomInteger } from "../utils/utils";


export type PieceType = "👻" | "😂" | "🔥" | "😺" | "🌮" | "[]"

type Tile = {
  posX:number;
  posY:number;
  pieceType:PieceType;
}

type Cursor = {
  x:number;
  y:number;
}

interface Props {
  player:string;
  columns:number;
  rows:number
}

interface State extends Props {
  board:Array<Tile>
  cursor:Cursor
}

export default class Board extends React.Component<Props, State>{
  constructor (props:Props) {
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

  getPieceType(piece:number) {
    return ["👻", "😂", "🔥", "😺", "🌮"][piece] as PieceType;
  }

  buildBoard(x:number, y:number) {
    const board = new Array(x * y);
    let id = 0;

    // build empty upper slots
    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < x; j++) {
        board[id] = {
          pieceType: `[]`,
          posX: j,
          posY: i,
        };
        id++;
      }
    }

    console.log("initial board", {board});
    // build actual blocks
    // FIXME
    // the board should be build with no matches
    for (var i = 6; i < y; i++) {
      for (var j = 0; j < x; j++) {
        board[id] = {
          pieceType: this.getPieceType(randomInteger(0, 4)),
          posX: j,
          posY: i,
        };
        id++;
      }
    }
    console.log("final board", {board});
    return board;
  }

  buildRow() {
    let row:Array<Tile> = [];
    for (var j = 0; j < 6; j++) {
      console.log(row);
      row = [
        ...(row || []),
        {
          pieceType: this.getPieceType(randomInteger(0, 4)),
          posX: j,
          posY: this.state.board[this.state.board.length - 1].posY + 1,
        },
      ];
    }
    return row;
  }

  swapTiles(x:number, y:number) {
    // debug performance
    var t0 = performance.now();

    var tiles = this.state.board;
    var tilesToSwap = tiles.filter(function (tile) {
      return (
        (tile.posX == x || tile.posX == x + 1)
        && tile.posY == y
        && tile.pieceType
      );
    });

    if (tilesToSwap.length != 2) return;

    // given what the MDN docs says about Array.prototype.filter() is incorrect,
    // it seems to pass a slice of the array it's filtering,
    // thus mutating the array that's being filtered
    var tmp = tilesToSwap[1].pieceType;
    tilesToSwap[1].pieceType = tilesToSwap[0].pieceType;
    tilesToSwap[0].pieceType = tmp;

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
    let pieceTrain:Array<PieceType> = [];
    board.forEach((tile, index) => {
      if(index+1 % 6 === 0 ) {
        console.log("NEW ROW")
        pieceTrain = [tile.pieceType];
      }
      if(tile.pieceType === "[]") return pieceTrain = [];
      if(pieceTrain.length >= 3 && !pieceTrain.includes(tile.pieceType)){

        const newBoard = [...board]

        // FIXME
        // there's a bug when matching pieces when the edge is the same,
        // it would consider 2 pieces next to each other a match,
        // UPDATE, actually it's due to the fact of the next row tile being the
        // same
        // 
        // FIXME 2
        // Only matches 3 in a row, need to allow for 4 to 6 horizontal
        for(let x = index-3; x < index; x++){
          newBoard.splice(x, 1, {pieceType:"[]", posX:board[x].posX, posY:board[x].posY});
        }

        console.log(newBoard, board)
        this.setState({board: newBoard})
      } 
      if(!pieceTrain.length) return pieceTrain = [tile.pieceType]
      if(pieceTrain.includes(tile.pieceType)) return pieceTrain = [...pieceTrain, tile.pieceType]
      console.log("nope", pieceTrain, tile)
      return pieceTrain = [tile.pieceType];
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
      board.splice(firstRow.pop() as number, 1);
    }

    this.setState({board});
  }

  moveCursor(cursor:Cursor) {
    this.setState({cursor});
  }

  render() {
    const tileSize = {width: 64, height: 64};
    const boardWidth = `${(3 + 2 + tileSize.width + 2 + 3) * this.state.columns}px`;

    const tiles = this.state.board.map((tile, index) => {
      const x = this.state.cursor.x;
      const y = this.state.cursor.y;
      let setCursor = false;

      if ((tile.posX == x || tile.posX == x + 1) && tile.posY == y) {
        setCursor = true;
      }

      return (
        <Tile
          key={index}
          pieceType={tile.pieceType}
          x={tile.posX}
          y={tile.posY}
          size={tileSize}
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
          style={{width: boardWidth}}
        >
          {tiles}
        </div>
      </div>
    );
  }
};
