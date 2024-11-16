import React, { useContext, useEffect, useState } from 'react';
import { Navbar, Nav, Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'; 
import './navbar.css';
import { AuthContext } from '../authContext';

const NavigationBar = () => {
  const navigate = useNavigate();
  const { role, avatar, clearAuthData } = useContext(AuthContext);
  const [displayedAvatar, setDisplayedAvatar] = useState(null);

  // Efecto para actualizar el avatar en la vista cuando cambia en el contexto
  useEffect(() => {
    console.log("Avatar en contexto ha cambiado:", avatar);
    setDisplayedAvatar(avatar);
  }, [avatar]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    clearAuthData();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg"> 
      <img src={'https://storage.cloud.google.com/mi-app-img/logo.png'} alt="Logo" className="nav-imagelogo" />
      <Navbar.Toggle aria-controls="navbar-nav" /> 
      <Navbar.Collapse id="navbar-nav">
        <Nav className="me-auto"> 
          {/* Home (Visible para todos) */}
          <div className="nav-item-container">
            <Nav.Link as={Link} to="/" className="nav-link-with-image">
              <img src={'https://storage.cloud.google.com/mi-app-img/home.png'} alt="Home" className="nav-image" />
              <span className="hover-text">Home</span>
            </Nav.Link>
          </div>

          {/* Vistas condicionales */}
          {role === 'parent' && (
            <>
              <div className="nav-item-container">
                <Nav.Link as={Link} to="/parenting" className="nav-link-with-image">
                  <img src={'https://storage.cloud.google.com/mi-app-img/parenting.png'} alt="Parenting" className="nav-image" />
                  <span className="hover-text">Parenting</span>
                </Nav.Link>
              </div>
              <div className="nav-item-container">
                <Nav.Link as={Link} to="/gameTime" className="nav-link-with-image">
                  <img src={'https://storage.cloud.google.com/mi-app-img/gameTime.png'} alt="Tiempo de Juego" className="nav-image" />
                  <span className="hover-text">Tiempo de Juego</span>
                </Nav.Link>
              </div>
              <div className="nav-item-container">
                <Nav.Link as={Link} to="/social" className="nav-link-with-image">
                  <img src={'https://storage.cloud.google.com/mi-app-img/social.png'} alt="Interacciones Sociales" className="nav-image" />
                  <span className="hover-text">Foro Gabu</span>
                </Nav.Link>
              </div>
              <div className="nav-item-container">
                <Nav.Link as={Link} to="/funZone" className="nav-link-with-image">
                  <img src={'https://storage.cloud.google.com/mi-app-img/game.png'} alt="FunZone" className="nav-image" />
                  <span className="hover-text">Fun Zone</span>
                </Nav.Link>
              </div>
            </>
          )}

          {role === 'coach' && (
            <>
              <div className="nav-item-container">
                <Nav.Link as={Link} to="/coachesView" className="nav-link-with-image">
                  <img src={'https://storage.cloud.google.com/mi-app-img/attendance.png'} alt="CoachesView" className="nav-image" />
                  <span className="hover-text">Registro de niños</span>
                </Nav.Link>
              </div>
              <div className="nav-item-container">
                <Nav.Link as={Link} to="/fullReport" className="nav-link-with-image">
                  <img src={'https://storage.cloud.google.com/mi-app-img/allAttendance.png'} alt="FullReport" className="nav-image" />
                  <span className="hover-text">Reporte Completo</span>
                </Nav.Link>
              </div>
              <div className="nav-item-container">
                <Nav.Link as={Link} to="/social" className="nav-link-with-image">
                  <img src={'https://storage.cloud.google.com/mi-app-img/social.png'} alt="Interacciones Sociales" className="nav-image" />
                  <span className="hover-text">Foro Gabu</span>
                </Nav.Link>
              </div>
            </>
          )}

          {role === 'admin' && (
            <>
              <div className="nav-item-container">
                <Nav.Link as={Link} to="/viewAllReports" className="nav-link-with-image">
                  <img src={'https://storage.cloud.google.com/mi-app-img/allReports.png'} alt="Todos los Reportes" className="nav-image" />
                  <span className="hover-text">Reportes</span>
                </Nav.Link>
              </div>
              <div className="nav-item-container">
                <Nav.Link as={Link} to="/registerUsers" className="nav-link-with-image">
                  <img src={'https://storage.cloud.google.com/mi-app-img/newUser.png'} alt="Nuevos Usuarios" className="nav-image" />
                  <span className="hover-text">Nuevos Usuarios</span>
                </Nav.Link>
              </div>
              <div className="nav-item-container">
                <Nav.Link as={Link} to="/viewUsers" className="nav-link-with-image">
                  <img src={'https://storage.cloud.google.com/mi-app-img/allUsers.png'} alt="Usuarios" className="nav-image" />
                  <span className="hover-text">Usuarios</span>
                </Nav.Link>
              </div>
              <div className="nav-item-container">
                <Nav.Link as={Link} to="/social" className="nav-link-with-image">
                  <img src={'https://storage.cloud.google.com/mi-app-img/social.png'} alt="Interacciones Sociales" className="nav-image" />
                  <span className="hover-text">Foro Gabu</span>
                </Nav.Link>
              </div>
            </>
          )}
        </Nav>

        {/* Botones adicionales */}
        <Nav className="ml-auto">
          <Button variant="outline-light" href="https://playgabu.com/es/old-home" target="_blank">Get Early Access</Button>
          {displayedAvatar ? (
            <Dropdown>
              <Dropdown.Toggle variant="link" id="dropdown-avatar">
                <img src={displayedAvatar} alt="Avatar" className="nav-avatar" />
              </Dropdown.Toggle>
              <Dropdown.Menu align="end" className='dropdown-menu-right'>
                <Dropdown.ItemText>¡Hola!</Dropdown.ItemText>
                <Dropdown.Item as={Link} to="/editAccount">Editar perfil</Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>Cerrar sesión</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Button variant="outline-light" as={Link} to="/login">Login</Button>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
