import React, { useState } from 'react';
import './admins.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const RegisterCoaches = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/registerCoach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowModal(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          password: '',
        });
      }
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
    }
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="signup-container">
      <h2>Registro de Coaches</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <label htmlFor="name" className="form-label">Nombre del coach:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="form-input"
        />

        <label htmlFor="email" className="form-label">Correo del coach:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="form-input"
        />

        <label htmlFor="phone" className="form-label">Número de contacto del coach:</label>
        <input
          type="phone"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="form-input"
        />

        <label htmlFor="password" className="form-label">Contraseña:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="form-input"
        />

        <button type="submit" className="btn-login">Registrar</button>
      </form>

      {/* Modal de confirmación */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Registro Exitoso</Modal.Title>
        </Modal.Header>
        <Modal.Body>¡Usuario registrado correctamente!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RegisterCoaches;
