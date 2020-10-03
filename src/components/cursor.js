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
    var move = false;

    const action = {
      'ArrowLeft':  () => { x--; move = true; },
      'ArrowUp':    () => { y--; move = true; },
      'ArrowRight': () => { x++; move = true; },
      'ArrowDown':  () => { y++; move = true; },
      'Shift':      () => { this.props.raise(); },
      ' ':          () => { this.props.swap(x, y); },
    }[event.key];

    action()

    if(move) {
      // for x max comparison, need to account for the second cursor on the right, - 1
      if(x < 0 || x >= this.state.columns - 1 || y < 0 || y >= this.state.rows)
        return;

      var position = {x:x, y:y};
      this.props.move(position);
      this.setState({pos: position});
    }

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
