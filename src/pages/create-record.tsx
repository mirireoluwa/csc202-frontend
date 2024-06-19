import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Patient {
  id: number;
  name: string;
  // Add other properties as needed
}

interface ClinicalRecord {
  clinicDate: Date;
  ailment: string;
  medicinePrescribed?: string;
  procedureUndertaken: string;
  dateOfNextAppt?: Date;
  patientId: number; // Added patientId to link clinical record with patient
}

const CreateClinicalRecord: React.FC = () => {
  const [state, setState] = useState<ClinicalRecord>({
    clinicDate: new Date(),
    ailment: '',
    medicinePrescribed: '',
    procedureUndertaken: '',
    dateOfNextAppt: new Date(),
    patientId: 0, // Initialize patientId
  });

  const [patients, setPatients] = useState<Patient[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch patients when component mounts
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://localhost:3000/patients'); // Adjust URL as per your backend endpoint
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      // Handle error fetching patients
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newClinicalRecord: ClinicalRecord = {
      clinicDate: state.clinicDate || new Date(),
      ailment: state.ailment,
      medicinePrescribed: state.medicinePrescribed,
      procedureUndertaken: state.procedureUndertaken,
      dateOfNextAppt: state.dateOfNextAppt || new Date(),
      patientId: state.patientId, // Assign selected patientId
    };

    try {
      const response = await axios.post('http://localhost:3000/records/create', newClinicalRecord);
      const createdRecord = response.data;
      setSuccessMessage(`Clinical record created on ${createdRecord.clinicDate}`);
      // Clear form after successful submission
      setState({
        clinicDate: new Date(),
        ailment: '',
        medicinePrescribed: '',
        procedureUndertaken: '',
        dateOfNextAppt: new Date(),
        patientId: 0, // Reset patientId after submission
      });
    } catch (error) {
      console.error('Error creating clinical record:', error);
      setErrorMessage('Failed to create clinical record. Please try again.');
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-white items-center font-sans">
      <header className="bg-white text-black shadow-md w-full">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
          <div className="space-x-4">
            <Link to="/patients/create">
              <button className="bg-white text-green-700 px-4 py-2 rounded-full hover:bg-green-600 hover:text-white transition-colors duration-300">
                Create Patient Details
              </button>
            </Link>
            <Link to="/patients">
              <button className="bg-white text-green-700 px-4 py-2 rounded-full hover:bg-green-600 hover:text-white transition-colors duration-300">
                Manage Patient Data
              </button>
            </Link>
            <Link to="/records">
              <button className="bg-white text-green-700 px-4 py-2 rounded-full hover:bg-green-600 hover:text-white transition-colors duration-300">
                Manage Clinical Records
              </button>
            </Link>
          </div>
        </div>
      </header>
      <div className="flex flex-col items-center justify-center flex-grow p-10">
        <div className="w-full max-w-lg bg-green-50 p-8 rounded-3xl shadow-lg mt-6">
          <h2 className="text-3xl font-semibold text-green-700 mb-6">Create Clinical Record</h2>
          <form onSubmit={handleSubmit}>
            {/* Clinic Date input */}
            <div className="mb-4">
              <label className="block text-gray-700">Clinic Date:</label>
              <input
                type="date"
                className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:border-green-500"
                value={state.clinicDate ? state.clinicDate.toISOString().substr(0, 10) : ''}
                onChange={(e) => setState({ ...state, clinicDate: new Date(e.target.value) })}
                required
              />
            </div>

            {/* Ailment input */}
            <div className="mb-4">
              <label className="block text-gray-700">Ailment:</label>
              <input
                type="text"
                className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:border-green-500"
                value={state.ailment}
                onChange={(e) => setState({ ...state, ailment: e.target.value })}
                required
              />
            </div>

            {/* Medicine Prescribed input */}
            <div className="mb-4">
              <label className="block text-gray-700">Medicine Prescribed:</label>
              <input
                type="text"
                className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:border-green-500"
                value={state.medicinePrescribed || ''}
                onChange={(e) => setState({ ...state, medicinePrescribed: e.target.value })}
              />
            </div>

            {/* Procedure Undertaken input */}
            <div className="mb-4">
              <label className="block text-gray-700">Procedure Undertaken:</label>
              <textarea
                className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:border-green-500"
                value={state.procedureUndertaken}
                onChange={(e) => setState({ ...state, procedureUndertaken: e.target.value })}
                required
              />
            </div>

            {/* Date of Next Appointment input */}
            <div className="mb-4">
              <label className="block text-gray-700">Date of Next Appointment:</label>
              <input
                type="date"
                className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:border-green-500"
                value={state.dateOfNextAppt ? state.dateOfNextAppt.toISOString().substr(0, 10) : ''}
                onChange={(e) => setState({ ...state, dateOfNextAppt: new Date(e.target.value) })}
              />
            </div>

            {/* Patient Selection dropdown */}
            <div className="mb-4">
              <label className="block text-gray-700">Select Patient:</label>
              <select
                className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:border-green-500"
                value={state.patientId}
                onChange={(e) => setState({ ...state, patientId: parseInt(e.target.value) })}
                required
              >
                <option value="">Select a patient</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} - ID: {patient.id}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit button */}
            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors duration-300"
              >
                Create Clinical Record
              </button>
              <Link
                to="/"
                className="bg-white text-green-500 border border-green-500 px-4 py-2 rounded-full hover:bg-green-100 transition-colors duration-300"
              >
                Back
              </Link>
            </div>

            {/* Success and Error Messages */}
            {successMessage && <p className="mt-4 text-green-700">{successMessage}</p>}
            {errorMessage && <p className="mt-4 text-red-700">{errorMessage}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateClinicalRecord;
