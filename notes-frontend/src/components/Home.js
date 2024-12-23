import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import WaveBackground from './WaveBackground'; 
import SpeechRecognitionComponent from "./SpeechRecognitionComponent";
import ErrorBoundary from './ErrorBoundary'; 

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isNoteSaved, setIsNoteSaved] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);  // State to hold the selected note for editing

  const handleLogout = () => {
    console.log('Logged out!');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const onEditNote = (noteId, content, isEditing) => {
    // Update the selected note when editing
    setSelectedNote({ noteId, content, isEditing });
  };

  const handleSetIsEditing = (isEditing) => {
    setSelectedNote((prevNote) => ({ ...prevNote, isEditing }));
  };

  return (
    <div className="home-wrapper">
      {/* Navbar with logout button */}
      <Navbar onLogout={handleLogout} />

      {/* Sidebar */}
      <Sidebar 
        toggleSidebar={toggleSidebar} 
        isNoteSaved={isNoteSaved} 
        onEditNote={onEditNote} // Pass the onEditNote function to Sidebar
      />

      {/* Wave Background */}
      <WaveBackground />

      {/* Content of the Home page */}
      <div className="content-wrapper p-4">
        <ErrorBoundary>
          <div className="speech-recognition-container flex justify-center items-center">
            <SpeechRecognitionComponent 
              setIsNoteSaved={setIsNoteSaved}
              selectedNote={selectedNote} // Pass the selectedNote to SpeechRecognitionComponent
              setIsEditing={handleSetIsEditing}
            />
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default Home;
