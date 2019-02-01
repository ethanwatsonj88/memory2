import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root) {
  ReactDOM.render(<Starter />, root);
}

// I borrow heavily from the react tictactoe structure.
class Starter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tiles: this.initializeValues(),
			isHidden: Array(16).fill(true),
			// null means we are on our first choice.
			firstChoiceIndex: null,
			// to prevent input after 2nd choice wrong
			disabled: false,
			score: 0,		// amount of clicks to win
		};
	}

	hideElement(index, firstChoiceIndex) {
		const isHidden1 = this.state.isHidden.slice();
		isHidden1[index] = true;
		isHidden1[firstChoiceIndex] = true;
   	  	console.log(firstChoiceIndex);
        let state1 = _.assign({}, this.state, { isHidden: isHidden1 }); 
 		this.setState(state1);

	}

	handleClick(index) {
		const tiles = this.state.tiles.slice();
		const isHidden = this.state.isHidden.slice();
		let disabled = this.state.disabled;
		let firstChoiceIndex = this.state.firstChoiceIndex;
		let score = this.state.score;
		//console.log('firstChoiceIndex:' + firstChoiceIndex);
		//console.log('isHidden:' + isHidden[index]);
		//console.log('tile:' + tiles[index]);
		//we don't want to change the actual index, let the tile handle visibility.
		//this.state.isHidden[index] = false;
		// if it is first choice, show visibility and store.
		// unless that thing is already isHidden=false
		if (firstChoiceIndex == null && isHidden[index]) {
			isHidden[index] = false;
			firstChoiceIndex = index;
			score++;
		}
		// if it is second choice, compare choice to stored first choice.
		// if matching, show second choice, remove stored choice.
		// if not matching, hide first choice and remove stored choice.
		// after, check if all tiles are shown. just check isHidden array.
		// DONE: bug. if press same bbutton twice, still shows.
		// SOL: check that index and firstchoiceindex are not the same too.
		else {
			// string comparison
			if (tiles[index] ==  tiles[firstChoiceIndex] && index != firstChoiceIndex) {
				isHidden[index] = false;
				firstChoiceIndex = null;
				score++;
			}
			// if user clicked same box twice OR box already visible. 
			else if(index == firstChoiceIndex || !isHidden[index]) {
				// if they are equal, just ignore this 
			}
			else {
				// show both, pause for one second, disable then hide by callign render again.
				isHidden[index] = false;
				isHidden[firstChoiceIndex] = false;
				disabled = true;
				let that = this;	// alt to bind
				let oldFirst = firstChoiceIndex;	// we losethis.
				window.setTimeout(function() {
        			const isHidden1 = that.state.isHidden.slice();
					let disabled1 = that.state.disabled;
        			isHidden1[index] = true;
      				isHidden1[oldFirst] = true;
					disabled1 = false;	 //re-enable after pause
        			let state1 = _.assign({}, that.state, { isHidden: isHidden1, disabled: disabled1 });
        			that.setState(state1);
				}, 1000);
				firstChoiceIndex = null;
				score++;
			}
		}
		let state1 = _.assign({}, this.state, { 
			tiles: tiles,
			isHidden: isHidden,
			firstChoiceIndex: firstChoiceIndex,
			disabled: disabled,
			score: score,
		});
		this.setState(state1);
		// then we should check if the game is over. game over = isHidden all is false.
		// possible bug: last time it is counted, if both flash unhidden, then flash back.
		// this is not possible. last two to be tested WIIL be equal.
		this.checkForGameOver();
	}

	checkForGameOver() {
		if (this.isGameOver()) {
			// game is over
			// disable all tiles
			let state1 = _.assign({}, this.state, { disabled: true, });
	        this.setState(state1);
		}
	}

	isGameOver() {
		const isHidden1 = this.state.isHidden.slice();
		// if isHidden includes 1 true value, the game is not over.
        return !(isHidden1.includes(true));
	}
	
	resetGame() {
		// to reset game: do not randomize tiles.
		// tiles should be all hidden
		// reset score.
		// is hidden all true
		// disabled is false.
		// do not use constructor because we do not want random tiles.
		// UPDATE: we do want to randomize tiles.
		const tiles1 = this.initializeValues();
		const isHidden1 = Array(16).fill(true);
		let firstChoiceIndex1 = null;
		let disabled1 = false;
		let score1 = 0;
		let state1 = _.assign({}, this.state, {
			tiles: tiles1,
			isHidden: isHidden1,
            firstChoiceIndex: firstChoiceIndex1,
            disabled: disabled1,
            score: score1,
        });
		this.setState(state1);

	}
	
	renderScore() {
		return (
			<Score
				value={this.state.score}
			/>
		);
	}

	renderTile(i) {
		if (this.state.disabled) {
			return (
            	<Tile
                	value={this.state.tiles[i]}
               		onClick={() => {}}
                	isHidden={this.state.isHidden[i]}
            	/>
        	);

		} else {
			return (
				<Tile
					value={this.state.tiles[i]}
					onClick={() => this.handleClick(i)}
					isHidden={this.state.isHidden[i]}
				/>
			);
		}
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
			return (<p>Game is Over! Your score is {this.state.score}</p>);
		}
	}

	render() {
		// array of 16 tiles
		//let tiles = this.initializeTiles();
		let tiles = this.state.board;
		return(
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

	// makes 4x4 grid of tiles, a-h a-h.
	initializeValues() {
		let tiles = [];
		let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
		for (let i = 0; i < 16; i++) {
			if (i < 8) {
				tiles[i] = alphabet[i];
			} else {
				// subtract 8 so that alphabet is repeated.
				tiles[i] = alphabet[i - 8];
			}
		}
		let shuffled = this.shuffleTiles(tiles);
		return shuffled;
	}

	// I used the Fisher-Yates shuffle algorithm. 
	//https://stackoverflow.com/a/2450976/1293256
	shuffleTiles(tileArray) {
		const tileArray1 = tileArray.slice();
		let currIndex = tileArray1.length;
		let temp, randIndex;
		while (0 !== currIndex) {
			randIndex = Math.floor(Math.random() * currIndex);
			currIndex--;
			
			temp = tileArray1[currIndex];
			tileArray1[currIndex] = tileArray1[randIndex];
			tileArray1[randIndex] = temp;
		}
		return tileArray1;
	}
}

function Tile(props) {
	let currValue = null;
	if (props.isHidden) {
		currValue = '';
	} else {
		currValue = props.value;
	}
	return (
		<button className="tile" onClick={ props.onClick }>
			{currValue}
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
