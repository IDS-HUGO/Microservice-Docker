import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMusic, FaPlus, FaEdit, FaTrash, FaExternalLinkAlt, FaTimes } from 'react-icons/fa';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://54.88.82.65:8000';

function App() {
  const [canciones, setCanciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    artista: '',
    album: '',
    url: '',
    genero: '',
    anio: ''
  });

  useEffect(() => {
    cargarCanciones();
  }, []);

  const cargarCanciones = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/canciones`);
      setCanciones(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las canciones. Verifica que el backend esté funcionando.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        anio: formData.anio ? parseInt(formData.anio) : null
      };

      if (editingId) {
        await axios.put(`${API_URL}/canciones/${editingId}`, dataToSend);
      } else {
        await axios.post(`${API_URL}/canciones`, dataToSend);
      }
      
      cargarCanciones();
      resetForm();
    } catch (err) {
      alert('Error al guardar la canción');
      console.error('Error:', err);
    }
  };

  const handleEdit = (cancion) => {
    setFormData({
      nombre: cancion.nombre,
      artista: cancion.artista,
      album: cancion.album || '',
      url: cancion.url,
      genero: cancion.genero || '',
      anio: cancion.anio || ''
    });
    setEditingId(cancion.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta canción?')) {
      try {
        await axios.delete(`${API_URL}/canciones/${id}`);
        cargarCanciones();
      } catch (err) {
        alert('Error al eliminar la canción');
        console.error('Error:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      artista: '',
      album: '',
      url: '',
      genero: '',
      anio: ''
    });
    setEditingId(null);
    setShowModal(false);
  };

  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <FaMusic className="header-icon" />
          <div>
            <h1>Canciones Favoritas</h1>
            <p className="subtitle">Sistema de gestión musical</p>
            <p className="author">por Hugo Francisco Luis Inclán</p>
          </div>
        </div>
        <button className="btn-add" onClick={() => setShowModal(true)}>
          <FaPlus /> Agregar Canción
        </button>
      </header>

      <main className="main-content">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Cargando canciones...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={cargarCanciones}>Reintentar</button>
          </div>
        ) : (
          <div className="canciones-grid">
            {canciones.map(cancion => (
              <div key={cancion.id} className="cancion-card">
                <div className="cancion-header">
                  <h3>{cancion.nombre}</h3>
                  <div className="cancion-actions">
                    <button 
                      className="btn-icon btn-edit" 
                      onClick={() => handleEdit(cancion)}
                      title="Editar"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="btn-icon btn-delete" 
                      onClick={() => handleDelete(cancion.id)}
                      title="Eliminar"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <p className="artista">{cancion.artista}</p>
                {cancion.album && <p className="album">📀 {cancion.album}</p>}
                <div className="cancion-info">
                  {cancion.genero && <span className="tag">{cancion.genero}</span>}
                  {cancion.anio && <span className="tag">{cancion.anio}</span>}
                </div>
                <a 
                  href={cancion.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-link"
                >
                  Escuchar <FaExternalLinkAlt />
                </a>
              </div>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? 'Editar Canción' : 'Nueva Canción'}</h2>
              <button className="btn-close" onClick={resetForm}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre de la canción *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: Bohemian Rhapsody"
                />
              </div>
              <div className="form-group">
                <label>Artista *</label>
                <input
                  type="text"
                  name="artista"
                  value={formData.artista}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: Queen"
                />
              </div>
              <div className="form-group">
                <label>Álbum</label>
                <input
                  type="text"
                  name="album"
                  value={formData.album}
                  onChange={handleInputChange}
                  placeholder="Ej: A Night at the Opera"
                />
              </div>
              <div className="form-group">
                <label>URL *</label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Género</label>
                  <input
                    type="text"
                    name="genero"
                    value={formData.genero}
                    onChange={handleInputChange}
                    placeholder="Ej: Rock"
                  />
                </div>
                <div className="form-group">
                  <label>Año</label>
                  <input
                    type="number"
                    name="anio"
                    value={formData.anio}
                    onChange={handleInputChange}
                    placeholder="1975"
                    min="1900"
                    max="2025"
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={resetForm}>
                  Cancelar
                </button>
                <button type="submit" className="btn-submit">
                  {editingId ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;