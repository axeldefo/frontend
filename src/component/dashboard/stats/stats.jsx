import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './stats.css';

const Stats = () => {
  const [stats, setStats] = useState(null);
  const keywordColors = ['#FF5733', '#33FF57', '#5733FF', '#FFFF33', '#33FFFF']; // Liste de couleurs pour les mots-clés
  const technologyColors = ['#FF5733', '#33FF57', '#5733FF', '#FFFF33', '#33FFFF']; // Liste de couleurs pour les technologies

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/projets/stats/all', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        // Mélanger les tableaux des statistiques
        const shuffledStats = {
          totalProjects: data.totalProjects,
          topKeywords: shuffleArray(data.topKeywords),
          topTechnologies: shuffleArray(data.topTechnologies),
          fullPercentageProjects: data.fullPercentageProjects,
          projectsByYear: data.projectsByYear
        };
        setStats(shuffledStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  // Fonction pour mélanger un tableau
  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  return (
    <div className="stats-container" id="stats">
      {stats && (
        <>
          <div className="total-projects">
            <h2>Total Projects</h2>
            <p>{stats.totalProjects}</p>
          </div>

          {/* Top Keywords */}
          <div className="top-keywords card">
            <h2>Top Keywords</h2>
            <div className="keyword-cloud">
              {stats.topKeywords.map((keyword, index) => (
                <div key={index} style={{ fontSize: `${10 + keyword.count * 2}px`, color: keywordColors[index % keywordColors.length] }}>{keyword.keyword}</div>
              ))}
            </div>
          </div>

          {/* Top Technologies */}
          <div className="top-technologies card">
            <h2>Top Technologies</h2>
            <div className="technology-cloud">
              {stats.topTechnologies.map((technology, index) => (
                <div key={index} style={{ fontSize: `${10 + technology.count * 2}px`, color: technologyColors[index % technologyColors.length] }}>{technology.technology}</div>
              ))}
            </div>
          </div>

          {/* Full Percentage Projects */}
          <div className="full-percentage-projects card">
            <h2>Full Percentage Projects</h2>
            <ul>
              {stats.fullPercentageProjects.map((project, index) => (
                <li key={index}>{project.title}</li>
              ))}
            </ul>
          </div>

          {/* Projects by Year */}
          <div className="projects-by-year">
            <h2>Projects par année</h2>
            <LineChart width={600} height={300} data={stats.projectsByYear}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </div>
        </>
      )}
    </div>
  );
};

export default Stats;
