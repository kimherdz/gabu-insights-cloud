import React from 'react';
import { useNavigate } from 'react-router-dom';
import './fun.css';

const FunZone = () => {
  const navigate = useNavigate();

  const redirectToGame = (path) => {
    navigate(path);
  };

  return (
    <div className='container'>
      <img
        src={'https://storage.cloud.google.com/mi-app-img/simon.png'} 
        alt="Simón Dice"
        onClick={() => redirectToGame('/games/simon')}
        className='responsive-img'
        
      />
      <img
        src={'https://storage.cloud.google.com/mi-app-img/mole.png'} 
        alt="Golpea al Topo"
        onClick={() => redirectToGame('/games/mole')}
        className='responsive-img'
        
      />
      
    </div>
  );
};

export default FunZone;