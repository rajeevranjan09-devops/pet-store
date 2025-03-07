import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

function PetList() {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/pets`)
      .then((response) => setPets(response.data))
      .catch((error) => console.error(error));
  }, []);

  const deletePet = (id) => {
    axios
      .delete(`${API_BASE_URL}/pets/${id}`)
      .then(() => setPets(pets.filter((pet) => pet.id !== id)))
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <Link to="/add">Add New Pet</Link>
      <ul>
        {pets.map((pet) => (
          <li key={pet.id}>
            <Link to={`/pets/${pet.id}`}>
              {pet.name} the {pet.type} - ${pet.price}
            </Link>{" "}
            <Link to={`/edit/${pet.id}`}>Edit</Link>{" "}
            <button onClick={() => deletePet(pet.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PetList;
