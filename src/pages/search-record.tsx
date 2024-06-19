import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios, { AxiosError } from 'axios'; // Import AxiosError for better type inference

interface ClinicalRecord {
  id: number;
  clinicDate: Date;
  ailment: string;
  medicinePrescribed?: string;
  procedureUndertaken: string;
  dateOfNextAppt?: Date;
}

const SearchClinicalRecord: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchId, setSearchId] = useState(id || '');
  const [record, setRecord] = useState<ClinicalRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (id) {
      setSearchId(id);
      fetchRecord(id);
    }
  }, [id]);

  const fetchRecord = async (recordId: string) => {
    try {
      const response = await axios.get<ClinicalRecord>(`http://localhost:3000/clinical-records/${recordId}`);
      setRecord(response.data);
      setErrorMessage('');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        handleAxiosError(error);
      } else {
        console.error('Error fetching clinical record:', error);
        setErrorMessage('Failed to fetch clinical record. Please try again.');
        setRecord(null);
      }
    }
  };

  const handleAxiosError = (error: AxiosError) => {
    if (error.response) {
      if (error.response.status === 404) {
        setErrorMessage(`Clinical record with ID ${searchId} not found`);
      } else {
        console.error('Error response:', error.response);
        setErrorMessage('Failed to fetch clinical record. Please try again.');
      }
    } else if (error.request) {
      console.error('Request made but no response received:', error.request);
      setErrorMessage('Failed to fetch clinical record. Please try again.');
    } else {
      console.error('Error setting up request:', error.message);
      setErrorMessage('Failed to fetch clinical record. Please try again.');
    }
    setRecord(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId) {
      fetchRecord(searchId);
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
            <Link to="/records/create">
              <button className="bg-white text-green-700 px-4 py-2 rounded-full hover:bg-green-600 hover:text-white transition-colors duration-300">
                Create Clinical Records
              </button>
            </Link>
            <Link to="/patients">
              <button className="bg-white text-green-700 px-4 py-2 rounded-full hover:bg-green-600 hover:text-white transition-colors duration-300">
                Manage Patient Data
              </button>
            </Link>
          </div>
        </div>
      </header>
      <div className="flex flex-col items-center justify-center flex-grow p-10">
        <form onSubmit={handleSearch} className="w-full max-w-lg bg-green-50 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-green-700">Search Clinical Record</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Record ID:</label>
            <input
              type="text"
              className="w-full p-2 mt-2 border rounded-full focus:outline-none focus:border-green-500"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors duration-300"
            >
              Search
            </button>
            <Link to="/">
              <button
                type="button"
                className="bg-white text-green-500 border border-green-500 px-4 py-2 rounded-full hover:bg-green-100 transition-colors duration-300"
              >
                Back
              </button>
            </Link>
          </div>
          {errorMessage && <p className="mt-4 text-red-700">{errorMessage}</p>}
        </form>
        {record && (
          <div className="mt-8 w-full max-w-lg bg-green-50 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-green-700">Clinical Record Details</h2>
            <div>
              <p>ID: {record.id}</p>
              <p>Clinic Date: {new Date(record.clinicDate).toDateString()}</p>
              <p>Ailment: {record.ailment}</p>
              <p>Medicine Prescribed: {record.medicinePrescribed || 'N/A'}</p>
              <p>Procedure Undertaken: {record.procedureUndertaken}</p>
              <p>Date of Next Appointment: {record.dateOfNextAppt ? new Date(record.dateOfNextAppt).toDateString() : 'N/A'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchClinicalRecord;