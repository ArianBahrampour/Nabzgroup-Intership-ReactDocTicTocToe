import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
function Square(props) {
  return (
    <button className={props.className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        className={this.props.className(i)}
        key={i}
      />
    );
  }

  render() {
    let rows = [];
    for (let i = 0; i < 3; i++) {
      let squares = [];
      for (let j = 0; j < 3; j++) {
        squares.push(this.renderSquare(3 * i + j));
      }
      rows.push(
        <div className="board-row" key={i}>
          {squares}
        </div>
      );
    }
    return rows;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      movesHistory: Array(9).fill(null),
      stepNumber: 0,
      xIsNext: true,
      winSquares: "",
      movesDir: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    let movesHistory = this.state.movesHistory;
    movesHistory[this.state.stepNumber] = i;
    this.setState({ winSquares: calculateWinner(squares) });
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      movesHistory: movesHistory,
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      winSquares: calculateWinner(squares)
    });
  }
  changeSquareStyle(i) {
    const squares = this.state.winSquares;
    let className = "square ";
    if (
      squares != null &&
      (squares[0] === i || squares[1] === i || squares[2] === i)
    )
      className += "square-win ";
    return className;
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
      winSquares: ""
    });
  }
  handleToggleChange() {
    this.setState({ movesDir: !this.state.movesDir });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const movesHistory = this.state.movesHistory;

    const moves = history.map((step, move) => {
      const row = Math.ceil(movesHistory[move - 1] / 3);
      const col = (movesHistory[move - 1] % 3) + 1;
      const desc = move
        ? "Go to move #" + move + "  (" + row + " , " + col + ")"
        : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} className="li">
            {desc}
          </button>
        </li>
      );
    });
    if (!this.state.movesDir) moves.reverse();

    let status;
    if (winner) {
      status = "Winner: " + winner[3];
    } else if (this.state.stepNumber < 9) {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    } else {
      status = "Draw";
    }

    return (
      <div className="game">
        <h1>Tic Toc Toe</h1>
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            className={i => this.changeSquareStyle(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div className="toggle">
            <label className="switch">
              <input
                type="checkbox"
                onClick={() => this.handleToggleChange()}
              />
              <span className="slider"></span>
            </label>
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c, squares[a]];
    }
  }
  return null;
}
