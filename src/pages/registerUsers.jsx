import React from 'react';
import { useNavigate } from 'react-router-dom';
import './fun.css';

const RegisterUsers = () => {
  const navigate = useNavigate();

  const redirectToRegis = (path) => {
    navigate(path);
  };

  return (
    <div className='container'>
      <img
        src={'https://storage.cloud.google.com/mi-app-img/parents.png'}
        alt="Papas"
        onClick={() => redirectToRegis('/admins/registerPapas')}
        className='responsive-img'
        
      />
      <img
        src={'https://storage.cloud.google.com/mi-app-img/coach.png'}
        alt="Coaches"
        onClick={() => redirectToRegis('/admins/registerCoaches')}
        className='responsive-img'
        
      />
      
    </div>
  );
};

export default RegisterUsers;