export const saveNoteApi = async (transcript, audioBlob, csrfToken) => {
    const formData = new FormData();
    formData.append('transcript', transcript);
    formData.append('audio', audioBlob, 'recording.webm');
  
    try {
      const response = await fetch('/api/notes/', {
        method: 'POST',
        headers: {
          'X-CSRFToken': csrfToken,
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to save note');
      }
  
      return response;
    } catch (error) {
      console.error('Error saving note:', error);
      throw error; // Re-throw the error to be handled by the caller
    }
  };
  