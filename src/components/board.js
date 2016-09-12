import React from 'react';
import classNames from 'classnames';
import Tile from './tile';
import Cursor from './cursor';

export default React.createClass({
    getInitialState: function () {
        return {
            player:  this.props.player,
            columns: this.props.columns || 6 ,
            rows:    this.props.rows    || 12,
            board:   this.buildBoard(this.props.columns, this.props.rows)
        };
    },
    getPieceType: function(blank) {
        blank = blank || false;
        var piece_type = ['👻', '😂', '🔥', '😺', '🌮'];
        var index = Math.floor(Math.random() * ((4 - 0 + 1) + 0));
        return (blank ? ' ' : piece_type[index]);
    },
    buildBoard: function(x, y) {
        var board = new Array();
        var id_num = 0;
        for(var i = 0; i < y; i++)
            for(var j = 0; j < x; j++)
                board.push({
                    piece_type:this.getPieceType(),
                    pos_x:j,
                    pos_y:i
                });

        return board;
    },
    swapTiles: function(x, y) {
        // debug performance
        var t0 = performance.now();

        var tiles = this.state.board;
        var tilesToSwap = tiles.filter(function (tile) {
            return (tile.pos_x == x || tile.pos_x == x + 1) && tile.pos_y == y && tile.piece_type !== '';
        });

        if (tilesToSwap.length != 2)
            return;

        // given what the MDN docs says about Array.prototype.filter() is incorrect,
        // it seems to pass a slice of the array it's filtering,
        // thus mutating the array that's being filtered
        var tmp = tilesToSwap[1].piece_type;
        tilesToSwap[1].piece_type = tilesToSwap[0].piece_type;
        tilesToSwap[0].piece_type = tmp;

        this.setState({board:tiles});

        // debug performance
        var t1 = performance.now();
        console.log('swapTiles t: ' + (t1 - t0) + 'ms');

        // debug
        console.log(this.state.player, x, y, tilesToSwap[1], tilesToSwap[0]);
    },
    raiseBoard: function() {
        console.log('TODO raiseBoard ' + this.state.player);
    },
    moveCursor: function() {
        console.log('TODO moveCursor ' + this.state.player);
    },
    render: function () {
        var tiles = this.state.board.map( (tile, index) => {
            return (<Tile
                        key={index}
                        piece_type={tile.piece_type}
                        pos_x={tile.pos_x}
                        pos_y={tile.pos_y} />
                    );
        });

        return (
            <div>
                <Cursor
                    player={this.state.player}
                    columns={this.state.columns}
                    rows={this.state.rows}
                    move={this.moveCursor}
                    swap={this.swapTiles}
                    raise={this.raiseBoard} />

                <div id="board"
                    data-player={this.state.player}
                    data-columns={this.state.columns}
                    data-rows={this.state.rows}>
                        {tiles}
                </div>
            </div>
        );
    }
});
