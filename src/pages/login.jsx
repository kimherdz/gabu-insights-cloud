import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './authContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();
  const { updateAuthData } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://34.122.229.106:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        
        const decodedToken = JSON.parse(atob(data.token.split('.')[1]));
        updateAuthData(decodedToken.role, decodedToken.id, decodedToken.avatar);
        
        if (decodedToken.role === 'parent') {
          navigate('/parenting');
        } else if (decodedToken.role === 'coach') {
          navigate('/coachesView');
        } else if (decodedToken.role === 'admin') {
          navigate('/viewAllReports');
        }
      } else {
        if (response.status === 401) {
          setModalMessage(data.message);
          setIsModalOpen(true);
        } else {
          alert(data.message);
        }
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Error al iniciar sesión. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {isLoading ? (
        <div className="loading">Cargando...</div>
      ) : (
        <>
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Correo Electrónico</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <div className="password-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="show-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-login">
              Iniciar Sesión
            </button>
            {isModalOpen && (
              <div className='modal'>
                <div className='modal-content'>
                  <p>{modalMessage}</p>
                  <button onClick={() => setIsModalOpen(false)}>Cerrar</button>
                </div>
              </div>
            )}
          </form>
        </>
      )}
    </div>
  );
};

export default Login;
