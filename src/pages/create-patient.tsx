import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export interface Patient {
    id?: number;
    firstName: string;
    surName: string;
    middleName: string;
    dateOfBirth: Date;
    homeAddress: string;
    dateOfRegistration: Date;
}

const CreatePatient: React.FC = () => {
    const [state, setState] = useState<Patient>({
        firstName: '',
        surName: '',
        middleName: '',
        dateOfBirth: new Date(),
        homeAddress: '',
        dateOfRegistration: new Date(),
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); 
        
        const newPatient: Patient = {
            firstName: state.firstName,
            surName: state.surName,
            middleName: state.middleName,
            dateOfBirth: state.dateOfBirth || new Date(), 
            homeAddress: state.homeAddress,
            dateOfRegistration: state.dateOfRegistration|| new Date(), 
        };

        try {
            const response = await axios.post('http://localhost:3000/patients/create', newPatient);
            const createdPatient = response.data;
            setSuccessMessage(`Patient ${createdPatient.firstName} ${createdPatient.surName} has been successfully created`);
        } catch (error) {
            console.error('Error creating patient:', error);
            setErrorMessage('Failed to create patient. Please try again.');
        }
    };

    return (
    <div className="flex flex-col h-screen w-screen bg-white items-center font-sans">
      <header className="bg-white text-black shadow-md w-full">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
                    <div className="space-x-4">
                        <Link to="/patients">
                            <button className="bg-white text-green-700 px-4 py-2 rounded-full hover:bg-green-600 hover:text-white transition-colors duration-300">
                                Manage Patient Data
                            </button>
                        </Link>
                        <Link to="/clinical-records/create">
                            <button className="bg-white text-green-700 px-4 py-2 rounded-full hover:bg-green-600 hover:text-white transition-colors duration-300">
                                Create Clinical Records
                            </button>
                        </Link>
                        <Link to="/clinical-records/create">
                            <button className="bg-white text-green-700 px-4 py-2 rounded-full hover:bg-green-600 hover:text-white transition-colors duration-300">
                                Manage Clinical Records
                            </button>
                        </Link>
                    </div>
                </div>
            </header>
            <div className="w-full max-w-lg bg-green-50 p-8 rounded-3xl shadow-lg mt-6">
                <h2 className="text-3xl font-semibold mb-6 text-green-700">Create Patient</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">First Name:</label>
                        <input
                            type="text"
                            value={state.firstName}
                            onChange={(e) => setState({ ...state, firstName: e.target.value })}
                            className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:border-green-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Last Name:</label>
                        <input
                            type="text"
                            value={state.surName}
                            onChange={(e) => setState({ ...state, surName: e.target.value })}
                            className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:border-green-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Middle Name:</label>
                        <input
                            type="text"
                            value={state.middleName}
                            onChange={(e) => setState({ ...state, middleName: e.target.value })}
                            className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:border-green-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Date of Birth:</label>
                        <input
                            type="date"
                            value={state.dateOfBirth ? state.dateOfBirth.toISOString().substr(0, 10) : ''}
                            onChange={(e) => setState({ ...state, dateOfBirth: new Date(e.target.value) })}
                            className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:border-green-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Home Address:</label>
                        <input
                            type="text"
                            value={state.homeAddress}
                            onChange={(e) => setState({ ...state, homeAddress: e.target.value })}
                            className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:border-green-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Registration Date:</label>
                        <input
                            type="date"
                            value={state.dateOfRegistration ? state.dateOfRegistration.toISOString().substr(0, 10) : ''}
                            onChange={(e) => setState({ ...state, dateOfRegistration: new Date(e.target.value) })}
                            className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:border-green-500"
                            required
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 hover:text-white transition-colors duration-300">
                            Create Patient
                        </button>
                        <Link to="/" className="bg-white text-green-500 border border-green-500 px-4 py-2 rounded-full hover:bg-green-100 hover:text-white transition-colors duration-300">
                            Back
                        </Link>
                    </div>
                    {successMessage && <p className="mt-4 text-green-700">{successMessage}</p>}
                    {errorMessage && <p className="mt-4 text-red-700">{errorMessage}</p>}
                </form>
            </div>
        </div>
    );
};

export default CreatePatient;
