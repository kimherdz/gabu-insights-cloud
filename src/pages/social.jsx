import React, { useState } from 'react';
import './style.css';

const Social = () => {
  // Estado para las publicaciones del foro
  const [posts, setPosts] = useState([
    { id: 1, user: 'Usuario1', content: '¡Hola! ¿Cómo están los niños hoy?' },
    { id: 2, user: 'Usuario2', content: 'Hoy tuvimos una gran sesión de juegos.' },
  ]);

  // Estado para el nuevo contenido del post
  const [newPost, setNewPost] = useState('');

  // Función para agregar una nueva publicación
  const handleAddPost = (e) => {
    e.preventDefault();
    if (newPost.trim()) {
      const newPostData = {
        id: posts.length + 1,
        user: 'Usuario' + (posts.length + 1),
        content: newPost,
      };
      setPosts([...posts, newPostData]);
      setNewPost(''); // Limpiar el campo
    }
  };

  return (
    <div className="forum-page">
      <h1 className="forum-title" style={{ fontWeight: 'bold'}}>Foro Gabu</h1>

      <div className="forum-container">
        <div className="content-container"> {/* Agrupando publicaciones y formulario */}
          <div className="post-section"> {/* Sección de publicaciones */}
            <h4 className="section-title">Publicaciones</h4>
            <ul className="post-list">
              {posts.map((post) => (
                <li key={post.id} className="post-item">
                  <strong className="post-user">{post.user}:</strong>
                  <p className="post-content">{post.content}</p>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="add-post-container"> {/* Sección de agregar publicaciones */}
            <h4 className="section-title">Agregar Publicación</h4>
            <form onSubmit={handleAddPost} className="post-form">
              <textarea
                rows="4"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Escribe tu mensaje aquí..."
                className="post-input"
              />
              <button type="submit" className="post-button">
                Publicar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Social;
