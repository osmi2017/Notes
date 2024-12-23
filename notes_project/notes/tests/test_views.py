# notes/tests/test_views.py

import pytest
from rest_framework import status
from django.urls import reverse
from django.contrib.auth.models import User
from notes.models import Note
from rest_framework.test import APIClient  # <-- Use APIClient here


@pytest.mark.django_db
def test_user_creation_success():
    client = APIClient()  # Use APIClient
    url = reverse('user-create')  # Ensure this URL is correct, based on your URLs configuration
    data = {
        "username": "testuser",
        "password": "testpassword123",
        "email": "testuser@example.com"
    }
    response = client.post(url, data, format='json')
    
    # Check response
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data["message"] == "User created successfully."
    
    # Verify the user was created in the database
    user = User.objects.get(username="testuser")
    assert user.email == "testuser@example.com"


from django.core.files.uploadedfile import SimpleUploadedFile

from django.core.files.uploadedfile import SimpleUploadedFile
import pytest
from rest_framework import status
from django.urls import reverse
from django.contrib.auth.models import User
from notes.models import Note

@pytest.mark.django_db
def test_create_note_with_audio_file_and_user():
    # Create a user
    user = User.objects.create_user(username="testuser", password="password123")
    
    # Use APIClient and authenticate the user
    client = APIClient()
    client.force_authenticate(user=user)  # Force authentication here
    
    url = reverse('note-list')  # Adjust the URL if necessary
    data = {
        "content": "Test Note",
        "user": user.id  # Include the user ID explicitly if required
    }

    # Mock the audio file
    audio_file = SimpleUploadedFile("test_audio.mp3", b"file_content", content_type="audio/mpeg")
    data["audio_file"] = audio_file
    
    # Send request to create note with audio file
    response = client.post(url, data, format='multipart')  # Use multipart for file uploads
    
    # Print the response data for debugging
    print(response.data)  # Add this to print the error message
    
    # Check response
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data["content"] == "Test Note"
    
    # Verify note is in the database
    note = Note.objects.get(id=response.data["id"])
    assert note.content == "Test Note"
    assert note.user == user  # Ensure the user is correctly assigned to the note
    assert note.audio_file.name.endswith("test_audio.mp3")  # Verify that the audio file is saved
