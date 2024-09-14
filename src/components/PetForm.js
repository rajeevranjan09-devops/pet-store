import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function PetForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState({ name: '', type: '', price: '' });

  useEffect(() => {
    if (id) {
      axios.get(`http://127.0.0.1:5000/pets/${id}`)
        .then(response => setPet(response.data))
        .catch(error => console.error(error));
    }
  }, [id]);

  const handleChange = (e) => {
    setPet({ ...pet, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      // Update existing pet
      axios.put(`http://127.0.0.1:5000/pets/${id}`, pet)
        .then(() => navigate(`/pets/${id}`))
        .catch(error => console.error(error));
    } else {
      // Add new pet
      axios.post('http://127.0.0.1:5000/pets', pet)
        .then(response => navigate(`/pets/${response.data.id}`))
        .catch(error => console.error(error));
    }
  };

  return (
    <div>
      <h2>{id ? 'Edit Pet' : 'Add New Pet'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Pet Name:</label>
          <input type="text" name="name" value={pet.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Type:</label>
          <input type="text" name="type" value={pet.type} onChange={handleChange} required />
        </div>
        <div>
          <label>Price:</label>
          <input type="number" name="price" value={pet.price} onChange={handleChange} required />
        </div>
        <button type="submit">{id ? 'Update Pet' : 'Add Pet'}</button>
      </form>
    </div>
  );
}

export default PetForm;
