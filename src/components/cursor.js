import React from 'react';


export default class Cursor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            player:  props.player,
            columns: props.columns,
            rows:    props.rows,
            pos: {
                x: 0,
                y: 0
            },
        };
    }

    keyDown(event) {
        console.log(event);
        var x = this.state.pos.x;
        var y = this.state.pos.y;

        const action = {
            'ArrowLeft':  () => { x--; },
            'ArrowUp':    () => { y--; },
            'ArrowRight': () => { x++; },
            'ArrowDown':  () => { y++; },
            'Shift':      () => { this.props.raise(); },
            ' ':          () => { this.props.swap(x, y); },
        }[event.key];

        action()

        // for x max comparison, need to account for the second cursor on the right, - 1
        if(x < 0 || x >= this.state.columns - 1 || y < 0 || y >= this.state.rows)
            return;

        this.props.move(x, y);
        this.setState({pos: {x: x, y: y}});

        // debug
        console.log(this.state.player, x, y);
    }

    componentDidMount() {
        window.addEventListener('keydown', this.keyDown.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.keyDown);
    }

    render() {
        return (
            <div id={this.state.player} data-x={this.state.pos.x} data-y={this.state.pos.y}></div>
        );
    }
};
