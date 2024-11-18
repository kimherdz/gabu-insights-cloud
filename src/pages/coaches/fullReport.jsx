import React, { useEffect, useState } from 'react';
import './coach.css';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CoachView = () => {
  const [attendances, setAttendances] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [updatedRow, setUpdatedRow] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://34.122.229.106:3001/coach/attendances', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const formattedData = response.data.map(attendance => ({
          ...attendance,
          fecha: new Date(attendance.fecha) // Formatear la fecha
        }));
        setAttendances(formattedData);
      } catch (error) {
        console.error('Error al obtener los registros de asistencia:', error);
      }
    };

    fetchAttendances();
  }, []);

  // Función para manejar el clic en una fila para editarla
  const handleEditRow = (rowIndex) => {
    setEditingRow(rowIndex);
    setUpdatedRow({ ...attendances[rowIndex] });
  };

  // Función para manejar el cambio de valor en la celda
  const handleValueChange = (e, columnKey) => {
    setUpdatedRow({
      ...updatedRow,
      [columnKey]: e.target.value,
    });
  };

  // Función para manejar el cambio de fecha
  const handleDateChange = (date) => {
    setUpdatedRow({
      ...updatedRow,
      fecha: date,
    });
  };

  // Función para guardar los cambios en la fila y enviar al backend
  const handleSaveChanges = async () => {
    const updatedAttendances = [...attendances];
    updatedAttendances[editingRow] = updatedRow;
    setAttendances(updatedAttendances);
    setEditingRow(null);
    const { nombre_nino, ...attendanceData } = updatedRow;

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://34.122.229.106:3001/coach/attendance/update',
        {
          id: updatedRow.id,
          data: {
            ...attendanceData,
            fecha: attendanceData.fecha.toISOString().split('T')[0], // Formateamos la fecha para el backend
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModalMessage('Registro actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar el registro:', error);
      setModalMessage('Error al actualizar el registro');
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="container d-flex justify-content-center mt-3">
      <h2>Reporte Completo</h2>
      <Table striped bordered hover>
        <thead>
          <tr className="text-center">
            <th>ID</th>
            <th>Nombre del Niño</th>
            <th>Actitud Positiva Cuando no se Eligió el Juego</th>
            <th>Actitud Positiva al Perder</th>
            <th>Negocio de Buena Fe y Cumplió Acuerdos</th>
            <th>Convivencia</th>
            <th>Comentarios</th>
            <th>Fecha</th>
            <th>Horas de Juego</th>
            <th>Editar</th>
          </tr>
        </thead>
        <tbody>
          {attendances.map((attendance, rowIndex) => (
            <tr key={attendance.id}>
              {Object.keys(attendance).map((columnKey) => (
                <td key={columnKey} className="text-center">
                  {editingRow === rowIndex ? (
                    columnKey === 'fecha' ? (
                      <DatePicker
                        selected={updatedRow.fecha}
                        onChange={(date) => handleDateChange(date)}
                        dateFormat="yyyy-MM-dd"
                        className="form-control"
                      />
                    ) : (
                      <input
                        type="text"
                        value={updatedRow[columnKey]}
                        onChange={(e) => handleValueChange(e, columnKey)}
                        className="form-control"
                      />
                    )
                  ) : (
                    columnKey === 'fecha' ? attendance[columnKey].toLocaleDateString() : attendance[columnKey]
                  )}
                </td>
              ))}
              <td className="text-center">
                {editingRow === rowIndex ? (
                  <button className='but' type="submit" onClick={handleSaveChanges}>
                    Guardar Cambios
                  </button>
                ) : (
                  <button className='but' type="submit" onClick={() => handleEditRow(rowIndex)}>
                    Editar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal de confirmación */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Actualización de Registro</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CoachView;
