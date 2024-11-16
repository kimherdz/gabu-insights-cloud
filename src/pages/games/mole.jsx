import React, { useState, useEffect } from 'react';
import '../fun.css';

const WhacAMole = () => {
  const [moles, setMoles] = useState(Array(9).fill(false)); // 9 agujeros
  const [score, setScore] = useState(0); // Puntuación
  const [gameOver, setGameOver] = useState(false); // Estado de fin de juego
  const [gameStarted, setGameStarted] = useState(false); // Estado de inicio del juego

  // Función para generar un topo aleatorio
  const generateMole = () => {
    const randomIndex = Math.floor(Math.random() * 9); // Número aleatorio entre 0 y 8
    const newMoles = Array(9).fill(false); // Resetear todos los agujeros
    newMoles[randomIndex] = true; // Colocar el topo en el agujero aleatorio
    setMoles(newMoles);
  };

  // Función para manejar el clic del usuario
  const whackMole = (index) => {
    if (moles[index]) {
      setScore(score + 1);
    }
  };

  // Lógica del juego: cada segundo aparece un nuevo topo
  useEffect(() => {
    if (!gameStarted || gameOver) return; // Si no ha comenzado o si el juego terminó, no hacer nada más

    const interval = setInterval(() => {
      generateMole(); // Genera un topo aleatorio
    }, 1500);

    // Fin del juego después de 30 segundos
    const gameTimer = setTimeout(() => {
      setGameOver(true);
    }, 30000); // El juego dura 30 segundos

    return () => {
      clearInterval(interval);
      clearTimeout(gameTimer);
    };
  }, [score, gameOver, gameStarted]);

  // Iniciar el juego
  const startGame = () => {
    setScore(0); // Resetear puntuación
    setGameOver(false); // Asegurarse de que el juego no esté terminado
    setGameStarted(true); // Iniciar el juego
  };

  // Reiniciar el juego
  const restartGame = () => {
    setScore(0); // Resetear puntuación
    setGameOver(false); // Asegurarse de que el juego no esté terminado
    setGameStarted(false); // Detener el juego
  };

  return (
    <div className="game-container">
      <h1>Whac-a-Mole</h1>
      <h2>Score: {score}</h2>
      {gameOver ? (
        <div>
          <h3>¡Juego Terminado!</h3>
          <button onClick={startGame}>Iniciar Nuevo Juego</button>
        </div>
      ) : (
        <div>
          <div className="game-board">
            {moles.map((isMole, index) => (
              <div
                key={index}
                className={`hole ${isMole ? 'active' : ''}`}
                onClick={() => whackMole(index)}
              >
                {isMole && <div className="mole"></div>}
              </div>
            ))}
          </div>
          {!gameStarted && (
            <button id="start-button" onClick={startGame}>Iniciar Juego</button>
          )}
        </div>
      )}
      {gameStarted && !gameOver && (
        <button id="start-button" onClick={restartGame}>Reiniciar Juego</button>
      )}
    </div>
  );
};

export default WhacAMole;
