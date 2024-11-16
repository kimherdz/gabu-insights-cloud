import React, { useState } from 'react';
import '../fun.css';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null)); // Estado del tablero
  const [isXNext, setIsXNext] = useState(true); // Determina si es el turno de X
  const [gameOver, setGameOver] = useState(false); // Estado de si el juego terminó

  // Función para manejar los clics en las casillas
  const handleClick = (index) => {
    if (board[index] || gameOver) return; // Si ya hay una jugada o el juego terminó, no hacer nada
    
    const newBoard = board.slice();
    newBoard[index] = isXNext ? 'X' : 'O'; // Alternar entre X y O
    setBoard(newBoard);
    setIsXNext(!isXNext); // Cambiar el turno
    checkWinner(newBoard); // Verificar si hay un ganador
  };

  // Función para verificar si hay un ganador
  const checkWinner = (board) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
      [0, 4, 8], [2, 4, 6] // Diagonales
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setGameOver(true); // Si hay un ganador, termina el juego
        return;
      }
    }

    if (!board.includes(null)) {
      setGameOver(true); // Si el tablero está lleno y no hay ganador, termina el juego (empate)
    }
  };

  // Función para reiniciar el juego
  const restartGame = () => {
    setBoard(Array(9).fill(null)); // Resetear el tablero
    setIsXNext(true); // Empezar con X
    setGameOver(false); // Continuar el juego
  };

  return (
    <div className="game-container">
      <h1>Tic-Tac-Toe</h1>
      <h2>{gameOver ? '¡Juego Terminado!' : `Turno de ${isXNext ? 'X' : 'O'}`}</h2>
      <div className="board">
        {board.map((value, index) => (
          <div 
            key={index} 
            className={`cell ${value ? 'filled' : ''}`} 
            onClick={() => handleClick(index)}>
            {value}
          </div>
        ))}
      </div>
      {gameOver && <button className="restart-button" onClick={restartGame}>Reiniciar Juego</button>}
    </div>
  );
};

export default TicTacToe;
