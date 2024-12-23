import React from 'react';
import { shallow } from 'enzyme';
import SpeechRecognitionComponent from './SpeechRecognitionComponent'; // Adjust the import path
import API from './../utils/api'; // Adjust the import path

// Mock the API module
jest.mock('./../utils/api');

describe('SpeechRecognitionComponent', () => {
  let wrapper;
  const setIsNoteSavedMock = jest.fn();
  const setIsEditingMock = jest.fn();
  const selectedNoteMock = null; // No selected note for this test

  beforeEach(() => {
    wrapper = shallow(
      <SpeechRecognitionComponent 
        setIsNoteSaved={setIsNoteSavedMock} 
        selectedNote={selectedNoteMock} 
        setIsEditing={setIsEditingMock} 
      />
    );
  });

  test('should save a note successfully', async () => {
    // Mock the API response for saving a note
    API.post.mockResolvedValueOnce({ status: 201 }); // Simulate a successful save response

    // Simulate user input
    wrapper.setState({ transcript: 'This is a test note.' });
    wrapper.setState({ audioBlob: new Blob() }); // Simulate an audio blob

    // Simulate clicking the save button
    await wrapper.find('button.save-button').simulate('click');

    // Wait for the saveNote function to complete
    await new Promise(setImmediate); // Wait for promises to resolve

    // Assert that the note was saved successfully
    expect(setIsNoteSavedMock).toHaveBeenCalledWith(true); // Check if setIsNoteSaved was called
    expect(wrapper.state('transcript')).toBe(''); // Check if the transcript input is cleared
  });

  test('should show an error message if saving fails', async () => {
    // Mock the API response for saving a note
    API.post.mockRejectedValueOnce(new Error('Failed to save note')); // Simulate a failed save response

    // Simulate user input
    wrapper.setState({ transcript: 'This is a test note.' });
    wrapper.setState({ audioBlob: new Blob() }); // Simulate an audio blob

    // Simulate clicking the save button
    await wrapper.find('button.save-button').simulate('click');

    // Wait for the saveNote function to complete
    await new Promise(setImmediate); // Wait for promises to resolve

    // Assert that the error message is displayed
    expect(wrapper.state('errorMessage')).toBe('Failed to save note.'); // Check if the error message is set
  });
});