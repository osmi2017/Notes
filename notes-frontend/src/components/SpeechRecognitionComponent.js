import React, { useState, useEffect, useRef } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './SpeechRecognitionComponent.css';
import { checkAndRefreshToken } from './../utils/tokenUtils';
import { jwtDecode } from 'jwt-decode';
import API from './../utils/api';

const SpeechRecognitionComponent = ({ setIsNoteSaved, selectedNote, setIsEditing }) => {
  const { noteId, content, isEditing } = selectedNote || {};
  const [edit, setEdit] = useState(false);
  const [transcript, setTranscript] = useState(content || '');
  const [isListening, setIsListening] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const recognition = useRef(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = true;
      recognition.current.onresult = handleSpeechRecognitionResult;
      recognition.current.onend = handleSpeechRecognitionEnd;
    } else {
      setErrorMessage('Speech recognition is not supported in this browser.');
    }
  }, []);

  const handleSpeechRecognitionResult = (event) => {
    const currentTranscript = Array.from(event.results)
      .map((result) => result[0].transcript)
      .join('');
    setTranscript(currentTranscript);
  };

  const handleContentChange = (event) => {
    setTranscript(event.target.value);
  };

  const handleSpeechRecognitionEnd = () => {
    setIsListening(false);
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
    }
  };

  const startListening = () => {
    if (recognition.current) {
      setIsListening(true);
      recognition.current.start();
      startRecordingAudio();
      setEdit(true);
    }
  };

  const stopListening = () => {
    if (recognition.current && typeof recognition.current.stop === 'function') {
      setIsListening(false);
      recognition.current.stop();  // Only call stop if it's a valid function
    } else {
      console.error('Speech recognition stop function is not available.');
    }
  };

  const startRecordingAudio = () => {
    setIsLoading(true);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorder.current = new MediaRecorder(stream);
        audioChunks.current = [];
        mediaRecorder.current.ondataavailable = handleAudioDataAvailable;
        mediaRecorder.current.onstop = handleAudioRecordingStop;
        mediaRecorder.current.start();
      })
      .catch(handleAudioRecordingError);
  };

  const handleAudioDataAvailable = (event) => {
    audioChunks.current.push(event.data);
  };

  const handleAudioRecordingStop = () => {
    const audioBlob1 = new Blob(audioChunks.current, { type: 'audio/mp3' });
    setAudioBlob(audioBlob1);
    audioChunks.current = [];
    setIsLoading(false);
  };

  const handleAudioRecordingError = (error) => {
    console.error('Error accessing microphone:', error);
    setIsLoading(false);
    setErrorMessage('Error accessing microphone. Please check your device settings.');
  };

  const saveNote = async () => {
    if (!transcript && !audioBlob) {
      setErrorMessage('Transcript or audio is missing. Cannot save.');
      return;
    }
    setIsLoading(true);

    try {
      await checkAndRefreshToken();
      const token = localStorage.getItem('token');
      const csrfToken = getCookie('csrftoken');

      if (!token || !csrfToken) {
        setErrorMessage('Token or CSRF token is missing. Please log in again.');
        setIsLoading(false);
        return;
      }

      const userId = await getUserIdFromToken(token);
      const formData = new FormData();
      formData.append('content', transcript);
      formData.append('audio_file', audioBlob);
      formData.append('user', userId);

      if (isEditing && noteId) {
        await updateNoteRequest(formData, noteId, token, csrfToken);
      } else {
        await sendSaveNoteRequest(formData, token, csrfToken);
      }
    } catch (error) {
      console.error('Error saving note:', error);
      setErrorMessage('An error occurred while saving the note.');
    } finally {
      setIsLoading(false);
    }
  };

  const getUserIdFromToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.user_id || decoded.sub;
    } catch (error) {
      console.error('Error decoding token:', error);
      throw new Error('Invalid token');
    }
  };

  const sendSaveNoteRequest = async (formData, token, csrfToken) => {
    try {
      const response = await API.post('/notes/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-CSRFToken': csrfToken,
        },
      });

      if (response.status === 201) {
        alert('Note saved successfully!');
        setTranscript('');
        setIsNoteSaved(true);
        setIsEditing(false);
        setEdit(false);
      } else {
        setErrorMessage('Failed to save note.');
      }
    } catch (error) {
      setErrorMessage('Failed to save note.');
    }
  };

  const updateNoteRequest = async (formData, noteId, token, csrfToken) => {
    try {
      const response = await API.put(`/notes/${noteId}/edit/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-CSRFToken': csrfToken,
        },
      });

      if (response.status === 200) {
        alert('Note updated successfully!');
        setTranscript('');
        setAudioBlob(null);
        setIsNoteSaved(true);
        setIsEditing(false);
        setEdit(false);
      } else {
        setErrorMessage('Failed to update note.');
      }
    } catch (error) {
      setErrorMessage('Failed to update note.');
      alert(error);
    }
  };

  const getCookie = (name) => {
    let value = '; ' + document.cookie;
    let parts = value.split('; ' + name + '=');
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  return (
    <div className="container speechReconContainer">
      <h1>{isEditing ? 'Edit Note' : 'Click and speak'}</h1>
      <button
        className={`mic-button ${isListening ? 'listening' : ''}`}
        onClick={isListening ? stopListening : startListening}
        disabled={isLoading}
        aria-label="mic-button"
      >
        <i className="fas fa-microphone"></i>
      </button>

      {isLoading && <p>Loading...</p>}

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {(isEditing && !edit) ? (
        <div>
          <h2>Edit Note</h2>
          <textarea
            defaultValue={content}
            onChange={handleContentChange}
            rows="4"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
      ) : (
        <p className="transcript-text">{transcript}</p>
      )}

      {(transcript || audioBlob) && (
        <button
          className="save-button text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
          onClick={saveNote}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Save'}
        </button>
      )}
    </div>
  );
};

export default SpeechRecognitionComponent;
