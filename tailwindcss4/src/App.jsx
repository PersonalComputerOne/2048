import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [board, setBoard] = useState(generateEmptyBoard());
  const [score, setScore] = useState(0);

  useEffect(() => {
    let newBoard = generateEmptyBoard();
    addRandomTile(newBoard);
    addRandomTile(newBoard);
    setBoard([...newBoard]);
  }, []);

  function generateEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  function addRandomTile(board) {
    let emptyCells = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (board[r][c] === 0) emptyCells.push([r, c]);
      }
    }
    if (emptyCells.length === 0) return;
    let [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  function handleKeyPress(event) {
    let newBoard = [...board.map(row => [...row])];
    let moved = false;

    if (event.key === 'ArrowLeft') moved = moveLeft(newBoard);
    if (event.key === 'ArrowRight') moved = moveRight(newBoard);
    if (event.key === 'ArrowUp') moved = moveUp(newBoard);
    if (event.key === 'ArrowDown') moved = moveDown(newBoard);

    if (moved) {
      addRandomTile(newBoard);
      setBoard(newBoard);
      if (checkGameOver(newBoard)) alert("Game Over!");
    }
  }

  function slide(row) {
    let arr = row.filter(val => val);
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        setScore(score + arr[i]);
        arr.splice(i + 1, 1);
      }
    }
    while (arr.length < 4) arr.push(0);
    return arr;
  }

  function moveLeft(board) {
    let moved = false;
    for (let r = 0; r < 4; r++) {
      let newRow = slide(board[r]);
      if (board[r].toString() !== newRow.toString()) moved = true;
      board[r] = newRow;
    }
    return moved;
  }

  function moveRight(board) {
    let moved = false;
    for (let r = 0; r < 4; r++) {
      let newRow = slide(board[r].reverse()).reverse();
      if (board[r].toString() !== newRow.toString()) moved = true;
      board[r] = newRow;
    }
    return moved;
  }

  function moveUp(board) {
    let moved = false;
    for (let c = 0; c < 4; c++) {
      let col = board.map(row => row[c]);
      let newCol = slide(col);
      if (col.toString() !== newCol.toString()) moved = true;
      for (let r = 0; r < 4; r++) board[r][c] = newCol[r];
    }
    return moved;
  }

  function moveDown(board) {
    let moved = false;
    for (let c = 0; c < 4; c++) {
      let col = board.map(row => row[c]).reverse();
      let newCol = slide(col).reverse();
      if (col.toString() !== newCol.toString()) moved = true;
      for (let r = 0; r < 4; r++) board[r][c] = newCol[r];
    }
    return moved;
  }

  function checkGameOver(board) {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (board[r][c] === 0) return false;
        if (c < 3 && board[r][c] === board[r][c + 1]) return false;
        if (r < 3 && board[r][c] === board[r + 1][c]) return false;
      }
    }
    return true;
  }

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen"
      tabIndex={0} 
      onKeyDown={handleKeyPress}>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">2048 Game</h1>
      <div id="game-board" className="grid grid-cols-4 gap-2 bg-gray-300 p-4 rounded-lg shadow-lg">
        {board.flat().map((value, index) => (
          <div key={index} className={`tile text-center font-bold text-lg ${value ? 'p-4 bg-yellow-400' : 'p-8 bg-gray-200'}`}>
            {value !== 0 && value}
          </div>
        ))}
      </div>
      <div className="mt-4">
        <p className="text-lg font-medium">Score: <span>{score}</span></p>
        <button 
          className="mt-2 px-4 py-2 text-black rounded-lg"
          onClick={() => {
            let newBoard = generateEmptyBoard();
            addRandomTile(newBoard);
            addRandomTile(newBoard);
            setBoard(newBoard);
            setScore(0);
          }}>
          Restart Game
        </button>
      </div>
    </div>
  );
}

export default App;
