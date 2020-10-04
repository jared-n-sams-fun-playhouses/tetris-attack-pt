import React from "react";
import Tile from "./tile";
import Cursor from "./cursor";
import { randomInteger } from "../utils/utils";

export type PieceType = "👻" | "😂" | "🔥" | "😺" | "🌮" | "[]";

type Tile = {
  posX: number;
  posY: number;
  pieceType: PieceType;
};

type Cursor = {
  x: number;
  y: number;
};

interface Props {
  player: string;
  columns: number;
  rows: number;
}

interface State extends Props {
  board: Array<Tile>;
  cursor: Cursor;
  combo: number;
  comboCount: number;
  paused: boolean;
}

export default class Board extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      player: props.player,
      columns: props.columns || 6,
      rows: props.rows || 12,
      board: [],
      combo: 0,
      comboCount: 0,
      paused: false,
      cursor: {
        x: 0,
        y: 0,
      },
    };
  }

  componentDidMount() {
    this.setState({
      board: this.buildBoard(this.state.columns, this.state.rows),
    });
  }

  getPieceType(piece: number) {
    return ["👻", "😂", "🔥", "😺", "🌮"][piece] as PieceType;
  }

  buildBoard(x: number, y: number) {
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

    console.log("initial board", { board });
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
    console.log("final board", { board });
    return board;
  }

  buildRow() {
    let row: Array<Tile> = [];
    for (var j = 0; j < 6; j++) {
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

  swapTiles(x: number, y: number) {
    // debug performance
    var t0 = performance.now();

    var tiles = this.state.board;
    var tilesToSwap = tiles.filter(function (tile) {
      return (
        (tile.posX == x || tile.posX == x + 1) &&
        tile.posY == y &&
        tile.pieceType
      );
    });

    if (tilesToSwap.length != 2) return;

    // given what the MDN docs says about Array.prototype.filter() is incorrect,
    // it seems to pass a slice of the array it's filtering,
    // thus mutating the array that's being filtered
    var tmp = tilesToSwap[1].pieceType;
    tilesToSwap[1].pieceType = tilesToSwap[0].pieceType;
    tilesToSwap[0].pieceType = tmp;

    this.setState({ board: tiles });

    // debug performance
    var t1 = performance.now();
    console.log("swapTiles t: " + (t1 - t0) + "ms");

    // debug
    // console.log(this.state.player, x, y, tilesToSwap[1], tilesToSwap[0]);
    if (!this.state.paused) this.searchForMatch();
    if (!this.state.comboCount) {
      this.dropPieces(this.state.paused ? 2000 : 500);
    }
  }

  doMatch(index: number, direction: string) {
    const { board } = this.state;
    const newBoard = [...board];

    //
    // FIXME 2
    // Only matches 3 in a row, need to allow for 4 to 6 horizontal

    if (direction === "horizontal") {
      for (let x = index - 3; x < index; x++) {
        newBoard.splice(x, 1, {
          pieceType: "[]",
          posX: board[x].posX,
          posY: board[x].posY,
        });
      }
    } else if (direction === "vertical") {
      for (let x = index - 13; x < index; x += 6) {
        newBoard.splice(x, 1, {
          pieceType: "[]",
          posX: board[x].posX,
          posY: board[x].posY,
        });
      }
    }

    // console.log(newBoard, board)
    this.setState({
      board: newBoard,
      combo: this.state.combo + 3,
      comboCount: this.state.comboCount + 1,
    });
    return [];
  }

  addToTrain(
    pieceTrain: Array<PieceType>,
    pieceType: PieceType,
    index: number,
    direction: string
  ) {
    const newPieceTrain = [...pieceTrain, pieceType];

    if (newPieceTrain.length >= 3) {
      this.doMatch(index + 1, direction);
      return [];
    } else {
      return newPieceTrain;
    }
  }

  searchX() {
    const { board } = this.state;
    let pieceTrain: Array<PieceType> = [];
    board.forEach((tile: Tile, index: number) => {
      // console.log(
      //   { index },
      //   index % 6,
      //   { pieceTrain },
      //   tile.pieceType,
      //   pieceTrain.length >= 3,
      //   !pieceTrain.includes(tile.pieceType)
      // );

      if (index % 6 === 0) {
        // console.log("------------NEW ROW-------------");
        return (pieceTrain = tile.pieceType === "[]" ? [] : [tile.pieceType]);
      }

      if (pieceTrain.includes(tile.pieceType)) {
        return (pieceTrain = this.addToTrain(
          pieceTrain,
          tile.pieceType,
          index,
          "horizontal"
        ));
      }

      // match 3
      if (pieceTrain.length >= 3 && !pieceTrain.includes(tile.pieceType)) {
        return (pieceTrain = this.doMatch(index, "horizontal"));
      }

      if (tile.pieceType === "[]") return (pieceTrain = []);

      if (!pieceTrain.length) return (pieceTrain = [tile.pieceType]);
      // console.log("nope", pieceTrain, tile);
      return (pieceTrain = [tile.pieceType]);
    });
  }

  searchY() {
    const { board } = this.state;
    let pieceTrain: Array<PieceType> = [];
    for (let x = 0; x < 6; x++) {
      for (let y = 0; y < board.length; y += 6) {
        const tile = board[y + x];
        // console.log(tile, y, pieceTrain);
        if (y % board.length === 0) {
          // console.log("------------NEW COLUMN-------------");
          pieceTrain = board[y + x].pieceType === "[]" ? [] : [tile.pieceType];
          continue;
        }

        if (pieceTrain.includes(tile.pieceType)) {
          pieceTrain = this.addToTrain(
            pieceTrain,
            tile.pieceType,
            y + x,
            "vertical"
          );
          continue;
        }

        // match 3
        if (pieceTrain.length >= 3 && !pieceTrain.includes(tile.pieceType)) {
          pieceTrain = this.doMatch(y + x, "vertical");
          continue;
        }

        if (tile.pieceType === "[]") {
          pieceTrain = [];
          continue;
        }

        if (!pieceTrain.length) {
          pieceTrain = [tile.pieceType];
          continue;
        }
        // console.log("nope", pieceTrain, tile);
        pieceTrain = [tile.pieceType];
      }
    }
  }

  applyCombo() {
    // send blocks to other side and/or score multiplier
    console.log("APPLYING COMBO:", `x${Math.floor(this.state.combo / 3)}`);
  }

  searchForMatch() {
    this.setState({ comboCount: 0 });
    // search x
    this.searchX();

    //search y
    this.searchY();

    this.applyCombo();
    if (this.state.comboCount) {
      this.dropPieces(2000)
    } else {
      this.setState({combo: 0});
    }
  }

  async dropPieces(wait: number) {
    // 2 second timer before drop
    console.log("wait for it..");
    this.setState({ paused: true });
    await new Promise((resolve) => setTimeout(resolve, wait));

    const { board } = this.state;
    let newBoard = [...board];

    // traverse vertically to find where blocks should fall
    for (let x = 0; x < 6; x++) {
      let column: Array<Tile> = [];
      for (let y = 0; y < board.length; y += 6) {
        column = [...column, board[x + y]];
        if (column.length === 12) {

          // sort tiles vertically
          const newColumn = column.reduce((prev, tile) => {
            if (tile.pieceType === "[]") return [tile, ...prev];
            return [...prev, tile];
          }, [] as Array<Tile>);

          console.log("new column", newColumn);

          // replace with posY
          newColumn.forEach((tile, index) => {
            const boardIndex = newBoard.indexOf(tile);
            console.log("board index", boardIndex);
            newBoard[boardIndex] = { ...tile, posY: index };
            console.log("updated tile", newBoard[boardIndex]);
          });
        }
      }
    }

    // sort based on new posY's set above
    const sortedBoard = newBoard.sort((a, b) => {
      console.log(a.posY, b.posY);
      return a.posY - b.posY || a.posX - b.posX;
    });

    console.log(sortedBoard);
    this.setState({ board: sortedBoard, paused: false });
    // continue combo loop
    this.searchForMatch();
    console.log("go!");
  }

  raiseBoard() {
    // FIXME, cursor need to stay on the last relative board/grid position
    const newRow = this.buildRow();
    const board = [...this.state.board, ...newRow];
    const firstRow = [0, 1, 2, 3, 4, 5];
    while (firstRow.length) {
      board.splice(firstRow.pop() as number, 1);
    }

    this.setState({ board });
  }

  moveCursor(cursor: Cursor) {
    this.setState({ cursor });
  }

  render() {
    const tileSize = { width: 64, height: 64 };
    const boardWidth = `${
      (3 + 2 + tileSize.width + 2 + 3) * this.state.columns
    }px`;

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
          style={{ width: boardWidth }}
        >
          {tiles}
        </div>
        <p style={{fontSize:"30px"}}>Combo Count: {Math.floor(this.state.combo / 3)}</p>
        <p style={{fontSize:"30px"}}>Blocks Cleared: {this.state.combo}</p>
      </div>
    );
  }
}
