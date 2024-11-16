import React from 'react';
import './style.css';


const Home = () => {
  return (
    <div>
      <h1 style={{ fontWeight: 'bold', textAlign: 'center', margin: '20px 0' }}>
        Gabu Insights
      </h1>
      <div className="home-container">
        <div className="right-aligned">
          <div className="text-box1">
            <p>
              A través de nuestra página web, podrás acceder a reportes
              detallados que destacan las habilidades adquiridas, el
              comportamiento en el juego y otros datos relevantes, facilitando el
              seguimiento del desarrollo cognitivo y social de los niños en un
              entorno digital seguro. Además, la plataforma incluye un juego
              educativo que fomenta el aprendizaje mientras los niños
              interactúan, combinando entretenimiento con el desarrollo de sus
              habilidades.
            </p>
          </div>
        </div>

        <div className="left-aligned">
          <h4>Por qué lo hacemos</h4>
          <div className="text-box2">
            <p>
              En Gabu, somos padres nosotros mismos y entendemos el equilibrio
              entre permitir que nuestros hijos exploren el mundo digital y
              garantizar su seguridad. Estamos comprometidos a empoderar a los
              padres con las herramientas y conocimientos necesarios para tener
              experiencias de juego más seguras y felices. Nuestro objetivo es
              crear un mundo donde cada niño pueda explorar, aprender y jugar en
              línea, proporcionando tranquilidad a los padres.
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
};


export default Home;
