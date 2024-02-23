import { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/LakeList.css";

const LakeList = () => {
  const [lakes, setLakes] = useState([]);

  useEffect(() => {
    const fetchLakes = async () => {
      try {
        const response = await axios.get('/lakes');
        setLakes(response.data);
      } catch (error) {
        console.error('Error fetching lakes:', error);
      }
    };

    fetchLakes();
  }, []); // Empty array as second argument to useEffect to run only on mount

  return (
    <div className="lake-list-container">
      <h2 className="title">List of Lakes:</h2>
      <ul className="lake-list">
        {lakes.map(lake => (
          <li key={lake.id} className="lake-item">
            <h3 className="lake-name">{lake.name}</h3>
            <p className="lake-info">Area: {lake.area} km²</p>
            <p className="lake-info">Depth: {lake.depth} m</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LakeList;
