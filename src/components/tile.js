import React from 'react';
import classNames from 'classnames';

export default React.createClass({
    getInitialState: function () {
        return {
            piece_type: this.props.piece_type,
            position: {
                x: this.props.pos_x,
                y: this.props.pos_y
            }
        };
    },
    render: function () {
        var class_name = classNames('tile');

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
});
