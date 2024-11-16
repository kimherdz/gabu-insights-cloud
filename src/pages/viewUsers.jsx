import React from 'react';
import { useNavigate } from 'react-router-dom';
import './fun.css';

const ViewUsers = () => {
  const navigate = useNavigate();

  const redirectToRegis = (path) => {
    navigate(path);
  };

  return (
    <div className='container'>
      <img
        src={'https://storage.cloud.google.com/mi-app-img/parents.png'}
        alt="Papas"
        onClick={() => redirectToRegis('/admins/viewPapas')}
        className='responsive-img'
        
      />
      <img
        src={'https://storage.cloud.google.com/mi-app-img/coach.png'}
        alt="Coaches"
        onClick={() => redirectToRegis('/admins/viewCoaches')}
        className='responsive-img'
        
      />
      <img
        src={'https://storage.cloud.google.com/mi-app-img/ninos.png'}
        alt="Coaches"
        onClick={() => redirectToRegis('/admins/viewChildren')}
        className='responsive-img'
        
      />
      
    </div>
  );
};

export default ViewUsers;