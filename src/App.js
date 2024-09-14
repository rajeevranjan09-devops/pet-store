import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PetList from './components/PetList';
import PetDetail from './components/PetDetail';
import PetForm from './components/PetForm';

function App() {
  return (
    <Router>
      <div className="container">
        <h1>Simple Pet Store</h1>
        <Routes>
          <Route path="/" element={<PetList />} />
          <Route path="/pets/:id" element={<PetDetail />} />
          <Route path="/add" element={<PetForm />} />
          <Route path="/edit/:id" element={<PetForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
