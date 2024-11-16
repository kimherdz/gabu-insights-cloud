import React, { useState, useEffect } from 'react';
import './coach.css';

const CoachView = () => {
  const [formData, setFormData] = useState({
    childName: '',
    positiveAttitudeWhenNotChosen: '',
    positiveAttitudeWhenLosing: '',
    goodFaith: '',
    coexistenceLevel: 5,
    comments: '',
    hoursPlayed: 1,
    gamePlayed: '',
    sessionDate: '',
  });

  const [children, setChildren] = useState([]);
  const [modalMessage, setModalMessage] = useState(''); 
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await fetch('http://localhost:3001/children');
        const data = await response.json();
        setChildren(data);
      } catch (error) {
        console.error('Error al obtener los niños:', error);
      }
    };

    fetchChildren();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.childName || !formData.gamePlayed || !formData.comments) {
      setModalMessage('Por favor, completa todos los campos obligatorios.');
      setShowModal(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/attendances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          nino_id: formData.childName,
          act_eleccion_juego: formData.positiveAttitudeWhenNotChosen === 'Sí' ? 1 : 0,
          act_perder: formData.positiveAttitudeWhenLosing === 'Sí' ? 1 : 0,
          negociar: formData.goodFaith === 'Sí' ? 1 : 0,
          convivencia: formData.coexistenceLevel,
          comentarios: formData.comments,
          fecha: formData.sessionDate,
          horas_juego: formData.hoursPlayed,
        }),
      });

      if (response.ok) {
        setModalMessage('Asistencia registrada con éxito');
        setFormData({
          childName: '',
          positiveAttitudeWhenNotChosen: '',
          positiveAttitudeWhenLosing: '',
          goodFaith: '',
          coexistenceLevel: 5,
          comments: '',
          hoursPlayed: 1,
          gamePlayed: '',
          sessionDate: '',
        });
      } else {
        setModalMessage('Error al registrar la asistencia');
      }
    } catch (error) {
      setModalMessage('Error al enviar el formulario');
    } finally {
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <h2>Registro de Comportamiento del Niño</h2>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <p>{modalMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Juego jugado durante la sesión */}
        <label htmlFor="gamePlayed">Juego jugado durante la sesión:</label>
        <select
          id="gamePlayed"
          name="gamePlayed"
          value={formData.gamePlayed}
          onChange={handleChange}
        >
          <option value="">Seleccionar</option>
          <option value="Minecraft">Minecraft</option>
          <option value="Roblox">Roblox</option>
          <option value="StumbleGuys">Stumble Guys</option>
        </select>

        {/* Lista desplegable de los niños */}
        <label htmlFor="childName">Niño:</label>
        <select
          id="childName"
          name="childName"
          value={formData.childName}
          onChange={handleChange}
        >
          <option value="">Seleccionar</option>
          {children.map((child) => (
            <option key={child.id} value={child.id}>{child.nombre}</option>
          ))}
        </select>

        {/* Fecha de la sesión */}
        <label htmlFor="sessionDate">Fecha de la sesión:</label>
        <input
          type="date"
          id="sessionDate"
          name="sessionDate"
          value={formData.sessionDate}
          onChange={handleChange}
        />

        <label>Actitud positiva cuando no se eligió el juego:</label>
        <select
          name="positiveAttitudeWhenNotChosen"
          value={formData.positiveAttitudeWhenNotChosen}
          onChange={handleChange}
        >
          <option value="">Seleccionar</option>
          <option value="Sí">Sí</option>
          <option value="No">No</option>
        </select>

        <label>Actitud positiva al perder:</label>
        <select
          name="positiveAttitudeWhenLosing"
          value={formData.positiveAttitudeWhenLosing}
          onChange={handleChange}
        >
          <option value="">Seleccionar</option>
          <option value="Sí">Sí</option>
          <option value="No">No</option>
        </select>

        <label>Negocio de buena fe y cumplió acuerdos:</label>
        <select
          name="goodFaith"
          value={formData.goodFaith}
          onChange={handleChange}
        >
          <option value="">Seleccionar</option>
          <option value="Sí">Sí</option>
          <option value="No">No</option>
        </select>

        <label htmlFor="coexistenceLevel">Nivel de convivencia:</label>
        <input
          type="range"
          id="coexistenceLevel"
          name="coexistenceLevel"
          min="1"
          max="10"
          value={formData.coexistenceLevel}
          onChange={handleChange}
        />
        <span>{formData.coexistenceLevel} / 10</span>

        <label htmlFor="hoursPlayed">Horas jugadas:</label>
        <input
          type="range"
          id="hoursPlayed"
          name="hoursPlayed"
          min="1"
          max="5"
          value={formData.hoursPlayed}
          onChange={handleChange}
        />
        <span>{formData.hoursPlayed} horas</span>

        <label htmlFor="comments">Comentarios generales:</label>
        <textarea
          id="comments"
          name="comments"
          value={formData.comments}
          onChange={handleChange}
        ></textarea>

        {/* Botón para enviar el formulario */}
        <button className='but' type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default CoachView;
