import React, { useState, useEffect } from 'react';
import '../fun.css';

const Simon = () => {
  const colors = ['green', 'red', 'yellow', 'blue'];
  const [gamePattern, setGamePattern] = useState([]);
  const [userPattern, setUserPattern] = useState([]);
  const [setLevel] = useState(0);
  const [message, setMessage] = useState("Simon Says");

  useEffect(() => {
    if (userPattern.length && userPattern.length === gamePattern.length) {
      checkAnswer();
    }
  }, [userPattern]);

  const startGame = () => {
    setGamePattern([]);
    setUserPattern([]);
    setLevel(1);
    setMessage("Nivel 1");
    nextLevel([]);
  };

  const nextLevel = (pattern) => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newPattern = [...pattern, randomColor];
    setGamePattern(newPattern);
    setUserPattern([]);
    setLevel(newPattern.length);
    setMessage(`Nivel ${newPattern.length}`);
    playPattern(newPattern);
  };

  const playPattern = (pattern) => {
    pattern.forEach((color, index) => {
      setTimeout(() => flashColor(color), (index + 1) * 600);
    });
  };

  const flashColor = (color) => {
    const button = document.getElementById(color);
    button.classList.add('active');
    setTimeout(() => button.classList.remove('active'), 300);
  };

  const handleUserClick = (color) => {
    const newUserPattern = [...userPattern, color];
    setUserPattern(newUserPattern);
    flashColor(color);
  };

  const checkAnswer = () => {
    if (JSON.stringify(userPattern) === JSON.stringify(gamePattern)) {
      setTimeout(() => nextLevel(gamePattern), 1000);
    } else {
      setMessage('¡Juego terminado! Presiona "Empezar" para reiniciar');
    }
  };

  return (
    <div>
        <h1>{message}</h1>
        <div className='game-container'>
         <div id="game-board">
            {colors.map(color => (
            <div
                key={color}
                id={color}
                className="color-button"
                onClick={() => handleUserClick(color)}
            />
            ))}
        </div>
        <button id="start-button" onClick={startGame}>Empezar</button>
        </div>
    </div>
  );
};

export default Simon;
