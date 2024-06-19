import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Patient } from './create-patient';

const PatientDetails: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [updateForm, setUpdateForm] = useState<Partial<Patient>>({});

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:3000/patients');
        setPatients(response.data);
      } catch (error) {
        setError('Error fetching patients');
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateForm({
      ...updateForm,
      [name]: value,
    });
  };

  const handleUpdatePatient = async (id: number) => {
    try {
      console.log('Updating patient with data:', updateForm);
      const response = await axios.patch(`http://localhost:3000/patients/${id}`, updateForm);
      console.log('Patient updated successfully:', response.data);
  
      setPatients(prevPatients => 
        prevPatients.map(patient => 
          patient.id === id ? { ...patient, ...response.data } : patient
        )
      );
  
      setSelectedPatient(null);
      setUpdateForm({});
      setError(null); // Clear any previous error messages
    } catch (error) {
      console.error('Error updating patient:', error);
      setError('Error updating patient');
      if (axios.isAxiosError(error) && error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
    }
  };
  

  const handleDeletePatient = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/patients/${id}`);
      console.log('Patient deleted successfully');
      setPatients(prevPatients => prevPatients.filter(patient => patient.id !== id));
    } catch (error) {
      console.error('Error deleting patient:', error);
      setError('Error deleting patient');
    }
  };

  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.surName} ${patient.middleName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen">{error}</div>;
  }

  return (
    <div className="flex flex-col w-screen mx-auto items-center">
      <h2 className="text-3xl font-bold my-4">Patients List</h2>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by name..."
        className="w-full max-w-lg p-2 mb-4 border rounded-lg focus:outline-none focus:border-green-500"
      />

      <div className="w-full max-w-3xl">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-green-50">
            <tr>
              <th className="py-2 px-4 border-b text-left">ID</th>
              <th className="py-2 px-4 border-b text-left">First Name</th>
              <th className="py-2 px-4 border-b text-left">Last Name</th>
              <th className="py-2 px-4 border-b text-left">Middle Name</th>
              <th className="py-2 px-4 border-b text-left">Date of Birth</th>
              <th className="py-2 px-4 border-b text-left">Address</th>
              <th className="py-2 px-4 border-b text-left">Registration Date</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients?.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{patient.id}</td>
                <td className="py-2 px-4 border-b">{patient.firstName}</td>
                <td className="py-2 px-4 border-b">{patient.surName}</td>
                <td className="py-2 px-4 border-b">{patient.middleName}</td>
                <td className="py-2 px-4 border-b">{new Date(patient.dateOfBirth).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">{patient.homeAddress}</td>
                <td className="py-2 px-4 border-b">{new Date(patient.dateOfRegistration).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedPatient(patient);
                      setUpdateForm({
                        firstName: patient.firstName,
                        surName: patient.surName,
                        middleName: patient.middleName,
                        dateOfBirth: patient.dateOfBirth,
                        homeAddress: patient.homeAddress,
                        dateOfRegistration: patient.dateOfRegistration,
                      });
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      if (patient.id !== undefined) handleDeletePatient(patient.id);
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPatient && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Update Patient</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (selectedPatient.id !== undefined) handleUpdatePatient(selectedPatient.id);
              }}
            >
              <div className="mb-4">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={updateForm.firstName || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="surName" className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  id="surName"
                  name="surName"
                  value={updateForm.surName || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="middleName" className="block text-sm font-medium text-gray-700">Middle Name</label>
                <input
                  type="text"
                  id="middleName"
                  name="middleName"
                  value={updateForm.middleName || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={updateForm.dateOfBirth ? new Date(updateForm.dateOfBirth).toISOString().substr(0, 10) : ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="homeAddress" className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  id="homeAddress"
                  name="homeAddress"
                  value={updateForm.homeAddress || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="dateOfRegistration" className="block text-sm font-medium text-gray-700">Registration Date</label>
                <input
                  type="date"
                  id="dateOfRegistration"
                  name="dateOfRegistration"
                  value={updateForm.dateOfRegistration ? new Date(updateForm.dateOfRegistration).toISOString().substr(0, 10) : ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPatient(null);
                    setUpdateForm({});
                    setError(null); // Clear any previous error messages
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDetails;

