import React from 'react';

function Square(props) {
    return (
        <button className="square" onClick={() => props.onClick()} style={props.style}>
          {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i, style) {
        return <Square key={i} value={this.props.squares[i]} onClick={() => this.props.handleClick(i)} style={style}/>;
    }
    render() {
        let status = this.props.xIsNext ? 'Next player: X' : 'Next player: O';
        const winner = calculateWinner(this.props.squares);
        if (winner) {
            status = 'Winner: ' + winner.winner;
            var a = winner.a;
            var b = winner.b;
            var c = winner.c;
        } else {
            status = 'Next player: ' + (this.props.xIsNext ? 'X' : 'O');
        }
        const boardRows = [];
        // Rewrite Board to use two loops to make the squares instead of hardcoding them.
        for (let i = 0; i < 3; i++) {
            const boardRow = [];
            for (let j = 0; j < 3; j++) {
                let location = i * 3 + j;
                // When someone wins, highlight the three squares that caused the win.
                boardRow.push(this.renderSquare(location, (location === a || location === b || location === c) ? { backgroundColor:'green' }: {}));
            }
            boardRows.push(<div key={i} className="board-row">{boardRow}</div>);
        }
        return (
            <div>
            <div className="status">{status}</div>
            {boardRows}
          </div>
        );
    }
}

class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            stepNumber: 0,
            history: [{
                squares: Array(9).fill(null)
            }],
            xIsNext: true,
            isReverse: false
        };
    }
    render() {
        const moves = this.state.history.map((step, move) => {
            const desc = move ?
                'Move #' + move :
                'Game start';
            let style = {};
            if (move === this.state.history.length - 1) {
                // Bold the currently-selected item in the move list.
                style = { fontWeight: 'bold' }
            }
            return (
                <li key={move}>
                <a href="#" style={style} onClick={() => this.jumpTo(move)}>{desc}</a>
              </li>
            )
        });
        if (this.state.isReverse) {
            moves.reverse();
        }
        return (
            <div className="game">
            <div className="game-board">
                <Board xIsNext={this.state.xIsNext} squares={this.state.history[this.state.stepNumber].squares} handleClick={(i) => this.handleClick(i)}/>
            </div>
            <div className="game-info">
              <div>
                <button className="button" onClick={()=>this.reverseList()}>Reverse List</button>
              </div>
              <div>
                <ol>{moves}</ol>
              </div>
            </div>
          </div>
        );
    }
    handleClick(i) {
        const history = this.state.history;
        const squares = history[this.state.stepNumber].squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            stepNumber: history.length,
            history: history.concat([{ squares: squares }]),
            xIsNext: !this.state.xIsNext
        });
    }
    jumpTo(step) {
            this.setState({
                stepNumber: step,
                history: this.state.history.slice(0, step + 1),
                xIsNext: (step % 2) ? false : true
            });
        }
        //Add a toggle button that lets you sort the moves in either ascending or descending order.
    reverseList() {
        this.setState({
            isReverse: !this.state.isReverse
        })
    }
};

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { winner: squares[a], a: a, b: b, c: c };
        }
    }
    return null;
}

export default Game;
