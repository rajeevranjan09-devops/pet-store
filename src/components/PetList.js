import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function PetList() {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/pets')
      .then(response => setPets(response.data))
      .catch(error => console.error(error));
  }, []);

  const deletePet = (id) => {
    axios.delete(`http://127.0.0.1:5000/pets/${id}`)
      .then(() => setPets(pets.filter(pet => pet.id !== id)))
      .catch(error => console.error(error));
  };

  return (
    <div>
      <Link to="/add">Add New Pet</Link>
      <ul>
        {pets.map(pet => (
          <li key={pet.id}>
            <Link to={`/pets/${pet.id}`}>
              {pet.name} the {pet.type} - ${pet.price}
            </Link>
            {' '}
            <Link to={`/edit/${pet.id}`}>Edit</Link>
            {' '}
            <button onClick={() => deletePet(pet.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PetList;
