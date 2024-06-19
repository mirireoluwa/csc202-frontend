import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './homepage.css'; // Import the CSS file for styling

const Homepage: React.FC = () => {
  const [welcomeMessage, setWelcomeMessage] = useState('Hello, Welcome to ToothFixers');
  const [showTypewriter, setShowTypewriter] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Change the welcome message after 10 seconds
    const timer = setTimeout(() => {
      setWelcomeMessage('How can we help you?');
      setShowTypewriter(true);
    }, 10000);

    return () => clearTimeout(timer); // Clear the timer on unmount
  }, []);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="flex flex-col h-screen w-screen font-sans relative">
      <div className="bg-animation">
        <img src="/image1.jpg" alt="Background 1" className={currentSlide === 0 ? "active" : ""} />
        <img src="/image2.jpg" alt="Background 2" className={currentSlide === 1 ? "active" : ""} />
        <img src="/image3.jpg" alt="Background 3" className={currentSlide === 2 ? "active" : ""} />
        <img src="/image4.jpg" alt="Background 4" className={currentSlide === 3 ? "active" : ""} />
        <img src="/image5.jpg" alt="Background 5" className={currentSlide === 4 ? "active" : ""} />
        <img src="/image6.jpg" alt="Background 6" className={currentSlide === 5 ? "active" : ""} />
        <img src="/image7.jpg" alt="Background 7" className={currentSlide === 6 ? "active" : ""} />
        <img src="/image8.jpg" alt="Background 8" className={currentSlide === 7 ? "active" : ""} />
      </div>
      <header className="bg-white text-black shadow-md z-20 w-full">
        <div className="container mx-auto flex items-center space-x-4 py-6 px-4">
          <div className="flex items-center space-x-4">
            <img src={"./logo.png"} alt="Logo" className="h-10 w-auto" />
          </div>
        </div>
      </header>

      {showTypewriter ? (
        <div className="absolute top-1/2 left-6 transform -translate-y-1/2 z-30">
          <h1 className="text-5xl font-bold text-white typewriter">
            {welcomeMessage}
          </h1>
        </div>
      ) : (
        <div className="absolute top-1/2 left-6 transform -translate-y-1/2 z-30">
          <h1 className="text-4xl font-bold text-white">
            {welcomeMessage}
          </h1>
        </div>
        
      )}


      <main className="flex-grow flex justify-center items-center"></main>

      <div className="button-container">
        <Link to="/patients/create" className="button">Create Patient Details</Link>
        <Link to="/clinical-records/create" className="button">Create Clinical Records</Link>
        <Link to="/patients" className="button">Manage Patient Data</Link>
        <Link to="/clinical-records" className="button">Manage Clinical Records</Link>
      </div>

      <div className="dot-navigation">
        {[...Array(8)].map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>

      <footer className="text-white py-4 text-center z-20 w-full">
        <p>&copy; 2024 ToothFixers | 22120613038</p>
      </footer>

    </div>
  );
};

export default Homepage;
