import React, {Component} from 'react'
import classNames from 'classnames';


export default class Tile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            piece_type: props.piece_type,
            position: {
                x: props.pos_x,
                y: props.pos_y
            }
        };
    }

    render() {
        var class_name = classNames('tile', {'cursor': this.props.cursor});

        return (
            <div
                className={class_name}
                data-type={this.props.piece_type}
                data-x={this.state.position.x}
                data-y={this.state.position.y}>
                    {this.props.piece_type}
            </div>
        );
    }
};
