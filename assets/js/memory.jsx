import React from 'react';
import ReactDOM from 'react-dom';
import _ from "lodash";

export default function memory_init(root, channel) {
  ReactDOM.render(<Memory channel={channel} />, root);
}

// Client-Side state for Hangman is:
// {
//    skel:  List of letters and _ indicating where good guesses go.
//    goods: Set of letters, good guesses
//    bads:  Set of letters, bad guesses
//    lives: Int               // initial lives
// }

class Memory extends React.Component {
  constructor(props) {
    super(props);

    this.channel = props.channel;
    this.state = {
			shown_tiles: [],
      disabled: false,
      score: 0,
			hideOne: null,
			hideTwo: null,
    };

    this.channel
        .join()
        .receive("ok", this.got_view.bind(this))
        .receive("error", resp => { console.log("Unable to join", resp); });
  }

  got_view(view) {
    console.log("new view", view);
    this.setState(view.game);
  }
 
	handleClick(index) {
		this.channel.push("click", { index: index })
				.receive("ok", this.got_view.bind(this));
	}
 
	resetGame() {
		this.channel.push("reset", 0)
				.receive("ok", this.got_view.bind(this));
	}

	render() {
		console.log("render")
		if (!(this.state.hideOne == null) && !(this.state.hideTwo == null)) {
			let that = this;
			// if both are not null, we need to hide these in 3 seconds.
			window.setTimeout(function() {
				console.log("pushing");
				that.channel.push("hide", { hideOne: that.state.hideOne })
						.receive("ok", that.got_view.bind(that));
			}, 1000);
		}
    return (
		<div className="everything">
			<div className="title">Memory Game</div>
			<div className="rules">
				<h1>Rules</h1>
				<ol>
					<li>Choose a first tile.</li>
					<li>Select a second tile.</li>
					<li>If these tiles match, they will remain unhidden.</li>
					<li>Try to uncover all tiles to win! :)</li>
				</ol>
			</div>
			<div className="tiles">
				<div className="firstRow">
					{this.renderTile(0)}
					{this.renderTile(1)}
					{this.renderTile(2)}
					{this.renderTile(3)}
				</div>
				<div className="secondRow">
					{this.renderTile(4)}
					{this.renderTile(5)}
					{this.renderTile(6)}
					{this.renderTile(7)}
				</div>
				<div className="thirdRow">
					{this.renderTile(8)}
					{this.renderTile(9)}
					{this.renderTile(10)}
					{this.renderTile(11)}
				</div>
				<div className="fourthRow">
					{this.renderTile(12)}
					{this.renderTile(13)}
					{this.renderTile(14)}
					{this.renderTile(15)}
				</div>
			</div>
			<div className="score">
				{this.renderScore()}
			</div>
			<div className="reset">
				{this.renderReset()}
			</div>
			<div className="gameOver">
				{this.renderGameOver()}
			</div>
		</div>
    );
  }
	
	renderTile(i) {
		if (this.state.disabled) {
			return (
				<Tile
					value={this.state.shown_tiles[i]}
					onClick={() => {}}
				/>
			);
		}
		else {
			return (
				<Tile
					value={this.state.shown_tiles[i]}
					onClick={() => this.handleClick(i)}
				/>
			);
		}
	}

	renderScore() {
		return (
			<Score
				value={this.state.score}
			/>
		);
	}
		
	renderReset() {
		return (
			<Reset
				onClick={() => this.resetGame()}
			/>
		);
	}

	renderGameOver() {
		if (this.isGameOver()) {
			return (<p>Game is over! Your score is {this.state.score}</p>);
		}
	}

	isGameOver() {
		const shown_tiles1 = this.state.shown_tiles.slice();
		return !shown_tiles1.includes("_");
	}
}

function Tile(props) {
	return (
		<button className="tile" onClick={ props.onClick }>
			{props.value}
		</button>
	);
}

function Score(props) {
	return (
		<p>{props.value}</p>
	);
}

function Reset(props) {
	return (
		<button
			className="reset" onClick={ props.onClick }>
			Reset
		</button>
	);
}
