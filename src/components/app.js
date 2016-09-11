import React from 'react';
import Board from './board';

export default React.createClass({
	getInitialState: function () {
		return {
			number_of_player: this.props.number_of_player || 1
		};
	},
  	render: function () {
		return (
		  	<div id="main">
		  		<Board
					player="1"
					columns={6}
					rows={14} />
			</div>
		);
  	}
});
