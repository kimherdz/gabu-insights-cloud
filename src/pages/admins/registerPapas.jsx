import React, { useState } from 'react';
import './admins.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const RegisterPapas = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    childName: '',
    childAge: '',
    minecraft: false,
    roblox: false,
    stumble_guys: false,
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
      const response = await fetch('http://localhost:3001/registerParent', {
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
          childName: '',
          childAge: '',
          minecraft: false,
          roblox: false,
          stumble_guys: false,
        });
      }
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
    }
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="signup-container">
      <h2>Registro de Papás e Hijos</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <label htmlFor="name" className="form-label">Nombre del padre o encargado:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="form-input"
        />

        <label htmlFor="email" className="form-label">Correo del padre o encargado:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="form-input"
        />

        <label htmlFor="phone" className="form-label">Número de contacto del padre o encargado:</label>
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

        <label htmlFor="childName" className="form-label">Nombre del niño:</label>
        <input
          type="text"
          id="childName"
          name="childName"
          value={formData.childName}
          onChange={handleChange}
          required
          className="form-input"
        />

        <label htmlFor="childAge" className="form-label">Edad del niño:</label>
        <input
          type="number"
          id="childAge"
          name="childAge"
          value={formData.childAge}
          onChange={handleChange}
          required
          className="form-input"
        />

        {/* Checkboxes para juegos */}
        <div className="form-group">
          <label className="form-label">Selecciona los juegos permitidos:</label>
          <div>
            <label htmlFor="minecraft">Minecraft</label>
            <input
              type="checkbox"
              id="minecraft"
              name="minecraft"
              checked={formData.minecraft}
              onChange={handleChange}
            />       
          </div>
          <div>
          <label htmlFor="roblox">Roblox</label>
            <input
              type="checkbox"
              id="roblox"
              name="roblox"
              checked={formData.roblox}
              onChange={handleChange}
            />            
          </div>
          <div>
            <label htmlFor="stumble_guys">Stumble Guys</label>
            <input
              type="checkbox"
              id="stumble_guys"
              name="stumble_guys"
              checked={formData.stumble_guys}
              onChange={handleChange}
            />
          </div>
        </div>

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

export default RegisterPapas;
