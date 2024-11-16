import React, { useEffect, useState } from 'react';
import './admins.css';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

const ViewChildren = () => {
  const [children, setChildren] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [updatedRow, setUpdatedRow] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/admin/children', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChildren(response.data);
      } catch (error) {
        console.error('Error al obtener los registros de niños:', error);
      }
    };

    fetchChildren();
  }, []);

  const handleEditRow = (rowIndex) => {
    setEditingRow(rowIndex);
    setUpdatedRow({ ...children[rowIndex] });
  };

  const handleValueChange = (e, columnKey) => {
    const value = ['minecraft', 'roblox', 'stumble_guys', 'status'].includes(columnKey)
      ? e.target.checked
      : e.target.value;
    setUpdatedRow({
      ...updatedRow,
      [columnKey]: value,
    });
  };

  const handleSaveChanges = async () => {
    const updatedChildren = [...children];
    updatedChildren[editingRow] = updatedRow;
    setChildren(updatedChildren);
    setEditingRow(null);

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:3001/admin/child/update',
        {
          id: updatedRow.id,
          data: updatedRow,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModalMessage('Registro de niño actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar el registro de niño:', error);
      setModalMessage('Error al actualizar el registro');
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="container d-flex justify-content-center mt-3">
      <h2>Lista Completa de Niños</h2>
      <Table striped bordered hover>
        <thead>
          <tr className="text-center">
            <th>ID</th>
            <th>Nombre</th>
            <th>Edad</th>
            <th>Padre</th>
            <th>Minecraft</th>
            <th>Roblox</th>
            <th>Stumble Guys</th>
            <th>Status</th>
            <th>Editar</th>
          </tr>
        </thead>
        <tbody>
          {children.map((child, rowIndex) => (
            <tr key={child.id}>
              {Object.keys(child).map((columnKey) => (
                <td key={columnKey} className="text-center">
                  {editingRow === rowIndex ? (
                    columnKey === 'status' ? (
                      <input
                        type="checkbox"
                        checked={updatedRow[columnKey]}
                        onChange={(e) => handleValueChange(e, columnKey)}
                      />
                    ) : ['minecraft', 'roblox', 'stumble_guys'].includes(columnKey) ? (
                      <input
                        type="checkbox"
                        checked={updatedRow[columnKey]}
                        onChange={(e) => handleValueChange(e, columnKey)}
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
                    columnKey === 'status' ? (
                      child[columnKey] ? 'Activo' : 'Inactivo'
                    ) : ['minecraft', 'roblox', 'stumble_guys'].includes(columnKey) ? (
                      child[columnKey] ? 'Sí' : 'No'
                    ) : (
                      child[columnKey]
                    )
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

export default ViewChildren;
