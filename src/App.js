import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  componentDidMount() {
    console.log('mounted')
  }

  render() {
    return (
      <div className="App">
        <div id="errors" style={{
          background: "#c00",
          color: "#fff",
          display: "none",
          margin: "-20px -20px 20px",
          padding: "20px",
          whiteSpace: "pre-wrap"
        }}>
        </div>
        <Game />
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      xIsNext: true,
    }
  }

  calculateWinner(squares) {
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
        return squares[a];
      }
    }
    return null;
  }

  jumpTo(move) {
    const { history, xIsNext } = this.state;
    const newState = {
      history: [...history.slice(0, move+1)],
      xIsNext: move % 2 === 0 ? true : false
    };
    this.setState(newState);
  }

  handleClick(i) {
    const { history, xIsNext } = this.state;
    const current = history[history.length - 1].squares;
    if (this.calculateWinner(current) || current[i]) {
      return;
    }
    const currentCopy = [...current];
    if (xIsNext) {
      currentCopy[i] = 'x';
    } else {
      currentCopy[i] = 'o';
    }

    const newHistory = [...history, { squares: currentCopy }];
    const newState = {
      history: newHistory,
      xIsNext: !xIsNext,
    };
    this.setState(newState);
  }

  render() {
    console.log(this.state)
    const { history, xIsNext } = this.state;
    const current = history[history.length - 1];
    const winner = this.calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })

    let status;
    if (winner) {
      status = 'Winner: ' + winner
    } else {
      status = 'Next player: ' + (xIsNext ? 'x' : 'o');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

function Square(props) {
  return (
    <button
      className="square"
      onClick={() => props.onClick()}
    >
      {props.value}
    </button>
  );
}


export default App;
