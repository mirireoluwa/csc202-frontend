import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/homepage';
import CreatePatient from './pages/create-patient';
import CreateRecord from './pages/create-record';
import PatientDetails from './pages/search-patient';
import ClinicalRecordDetails from './pages/search-record';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path = "/" element = {<HomePage/>} />
        <Route path = "patients/create" element = { <CreatePatient/>} />
        <Route path = "/clinical-records/create" element = { <CreateRecord/>} />
        <Route path = "/patients" element = { <PatientDetails/>} />
        <Route path = "/clinical-records" element = { <ClinicalRecordDetails/> } />
      </Routes>
    </Router>
  );
};

export default App;