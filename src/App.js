import React, { useState, useEffect } from 'react';
import jsonData from './data/data.json';
import axios from 'axios';
import './App.css';
function App() {
  const apiUrl = 'https://geo.api.gouv.fr/departements/';
  const [departementNames, setDepartementNames] = useState([]);
  const [selectedDepartementCode, setSelectedDepartementCode] = useState('');
  const [selectedDepartementNames, setSelectedDepartementNames] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const allDepartementCodes = jsonData.flatMap((person) => person.departments);
      const uniqueDepartementCodes = [...new Set(allDepartementCodes)];

      const nameDpts = [];
      for (const code of uniqueDepartementCodes) {
        try {
          const response = await axios.get(`${apiUrl}${code}`);
          nameDpts.push(response.data.nom);
        } catch (error) {
          console.error(`Erreur lors de la récupération du nom du département ${code}:`, error);
          nameDpts.push(`Département ${code} non trouvé`);
        }
      }

      setDepartementNames(nameDpts);
    };

    fetchData();
  }, []);

  function handleDepartementChange(event) {
    const selectedIndex = event.target.selectedIndex;
    const selectedCode = jsonData.flatMap((person) => person.departments)[selectedIndex];
    setSelectedDepartementCode(selectedCode);
    const selectedNames = jsonData.filter((person) => 
    person.departments.includes(selectedCode))
      .map((person) => person.name);
    setSelectedDepartementNames(selectedNames);
  }

  return (
    <div className="App">
      <header className="App-header"></header>

      <body>
        <div className='board'>
          {jsonData.map((person) => (
            <p key={person.id}>{person.name}</p>
          ))}
        </div>

        <div>
          <select onChange={handleDepartementChange} className='selectDpts'>
            {departementNames.map((name, index) => (
              <option key={index} value={index}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div>Prénoms associés au département sélectionné :</div>
          <ul>
            {selectedDepartementNames.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        </div>
      </body>
    </div>
  );
}

export default App;
