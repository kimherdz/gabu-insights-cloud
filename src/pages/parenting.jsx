import React, { useState, useEffect } from 'react';
import * as echarts from 'echarts';
import './style.css';

const Parenting = () => {
  const [comments, setComments] = useState([]);
  const [skillsData, setSkillsData] = useState({ act_perder: 0, negociar: 0, act_eleccion_juego: 0 });



  // Función para obtener los comentarios de los coaches
  const fetchComments = async () => {
    try {
      const response = await fetch('http://34.122.229.106:3001/attendances/comments', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error al obtener comentarios:', error);
    }
  };

  // Función para obtener los datos de la gráfica
  const fetchSkillsData = async () => {
    try {
      const response = await fetch('http://34.122.229.106:3001/attendances/skills', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setSkillsData(data);
    } catch (error) {
      console.error('Error al obtener datos de habilidades:', error);
    }
  };

  useEffect(() => {
    fetchComments();
    fetchSkillsData();
  }, []);

  useEffect(() => {
    const chartDom = document.getElementById('chart');
    const myChart = echarts.init(chartDom);

    const option = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        left: 'center',
        top: '1%',
        textStyle: {
          fontSize: 20,
          color: '#000',
          fontFamily: 'Poppins, sans-serif',
        },
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 3,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: skillsData.act_eleccion_juego, name: 'Actitud positiva cuando no se eligió su juego', itemStyle: { color: '#fea55c' } }, 
            { value: skillsData.act_perder, name: 'Actitud positiva al perder', itemStyle: { color: '#533ed8' } },
            { value: skillsData.negociar, name: 'Negoció de buena fe y cumplió acuerdos', itemStyle: { color: '#5f66cf' } },
          ],
        },
      ],
    };

    myChart.setOption(option);
  }, [skillsData]);

  return (
    <div className="parenting-container">
      <h1 style={{ fontWeight: 'bold' }}>Parenting</h1>

      <div className="content-container">
        <div className="comments-section">
          <h3 className="centered-text">Coaches Insights</h3>
          <ul>
            {comments.map((comment, index) => (
              <li key={index}>
                <strong>{comment.coach_name}:</strong> {comment.comentarios}
              </li>
            ))}
          </ul>
        </div>

        <div className="chart-container">
          <h3 className="centered-text">Habilidades Adquiridas</h3>
          <div id="chart" style={{ width: '100%', height: 450 }}></div>
        </div>
      </div>
    </div>
  );
};

export default Parenting;
