import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { checkAndRefreshToken } from './../utils/tokenUtils';
import API from './../utils/api';


// Function to retrieve CSRF token from cookies
const getCookie = (name) => {
  let value = "; " + document.cookie;
  let parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const Sidebar = ({ toggleSidebar, isNoteSaved, onEditNote }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [audioFiles, setAudioFiles] = useState([]); // State to store fetched audio files
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  

  // Fetch notes when the component mounts or when isNoteSaved changes
  useEffect(() => {
    const fetchNotes = async () => {
      await checkAndRefreshToken();
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const csrfToken = getCookie('csrftoken'); // Get CSRF token from cookies

      if (token) {
        try {
          const decoded = jwtDecode(token); // Decode the token
          const userId = decoded.user_id || decoded.sub; // Extract user ID
         

          const response = await API.get(`/notes/by-user/${userId}/`, {
            headers: {
              'Authorization': `Bearer ${token}`, // Include Bearer token
              'X-CSRFToken': csrfToken,          // Include CSRF token
            },
          });

          // Filter out items where audio_file is null
          const filteredAudioFiles = response.data.filter(note => note.audio_file !== null);
          setAudioFiles(filteredAudioFiles); // Store filtered audio files in state
        } catch (error) {
          console.error("Error fetching notes:", error);
        }
      }
      setIsLoading(false); // End loading state
    };

    fetchNotes(); // Call the fetch function
  }, [isNoteSaved, toggleSidebar]); // Add isNoteSaved to the dependency array

  const processAudioFile = (audioPath) => {
    return audioPath.replace('/media/home/soro/Documents/notes_project', 'http://localhost:8000');
  };

  const deleteAudioFile = async (noteId) => {
    const token = localStorage.getItem('token');
    const csrfToken = getCookie('csrftoken'); // Get CSRF token from cookies

    try {
      await API.delete(`/notes/${noteId}/delete/`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include Bearer token
          'X-CSRFToken': csrfToken,          // Include CSRF token
        },
      });
      // Remove the deleted note from the state
      setAudioFiles(audioFiles.filter(note => note.id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div className="flex">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-12 z-50 flex items-center justify-center w-15 h-10 bg-blue-700 text-white rounded-md focus:outline-none hover:bg-blue-800 transition duration-300"
      >
        <div className="relative w-6 h-0.5 bg-white transition-all duration-300 transform" />
        <div className="relative w-6 h-0.5 bg-white transition-all duration-300 transform my-1" />
        <div className="relative w-6 h-0.5 bg-white transition-all duration-300 transform" />
        <span className="ml-2 text-white">Click to see List of Audio Files</span>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-14 left-0 z-40 w-80 max-h-[80vh] overflow-y-auto transition-transform duration-300 bg-white shadow-lg transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ maxHeight: '80vh' }}
      >
        <h5 className="text-lg font-semibold text-gray-700">Menu</h5>
        <ul className="mt-2 space-y-2">
          {isLoading ? (
            <li>Loading...</li>
          ) : audioFiles.length > 0 ? (
            audioFiles.map((note) => (
              <li key={note.id} className="mb-4 p-2 border-b">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900">Date: {note.created_at}</span>
                  <a href={processAudioFile(note.audio_file)} target="_blank" rel="noopener noreferrer" className="text-blue-500">Download</a>
                </div>
                <p className="text-gray-700 mt-1">{note.content}</p>
                <audio controls className="w-full mt-2" aria-label={`Audio file for note created on ${note.created_at}`}>
                  <source src={processAudioFile(note.audio_file)} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
                <div className="flex justify-between items-center mt-2">
                  <button
                    onClick={() => deleteAudioFile(note.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => onEditNote(note.id, note.content, true)} // Ensure onEditNote is passed correctly
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li>No audio files found.</li>
          )}
        </ul>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default Sidebar;
