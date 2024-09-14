import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function PetDetail() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/pets/${id}`)
      .then(response => setPet(response.data))
      .catch(error => console.error(error));
  }, [id]);

  if (!pet) return <div>Loading...</div>;

  return (
    <div>
      <h2>{pet.name} the {pet.type}</h2>
      <p>Price: ${pet.price}</p>
      <Link to={`/edit/${pet.id}`}>Edit Pet</Link>
      {' '}
      <Link to="/">Back to Pet List</Link>
    </div>
  );
}

export default PetDetail;
