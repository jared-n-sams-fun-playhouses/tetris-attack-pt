import React from 'react';
import classNames from 'classnames';

export default React.createClass({
    getInitialState: function () {
        return {
            player:  this.props.player,
            columns: this.props.columns,
            rows:    this.props.rows,
            pos: {
                x: 0,
                y: 0
            },
            controls: {
                left:  'ArrowLeft',
                up:    'ArrowUp',
                right: 'ArrowRight',
                down:  'ArrowDown',
                raise: 'Shift',
                swap:  ' '
            }
        };
    },
    keyDown: function(event) {
        console.log(event);
        var x = this.state.pos.x;
        var y = this.state.pos.y;

        switch (event.key) {
            case this.state.controls.left:
                x--;
                break;
            case this.state.controls.up:
                y--;
                break;
            case this.state.controls.right:
                x++;
                break;
            case this.state.controls.down:
                y++;
                break;
            case this.state.controls.raise:
                this.props.raise();
                break;
            case this.state.controls.swap:
                this.props.swap(x, y);
                break;
        }

        // for x max comparison, need to account for the second cursor on the right, - 1
        if(x < 0 || x >= this.state.columns - 1 || y < 0 || y >= this.state.rows)
            return;

        this.props.move(x, y);
        this.setState({pos: {x: x, y: y}});

        // debug
        console.log(this.state.player, x, y);
    },
    componentDidMount: function() {
        window.addEventListener('keydown', this.keyDown);
    },
    componentWillUnmount: function() {
        window.removeEventListener('keydown', this.keyDown);
    },
    render: function () {
        return (
            <div id={this.state.player} data-x={this.state.pos.x} data-y={this.state.pos.y}></div>
        );
    }
});
