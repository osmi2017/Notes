you can watch a demonstration video here:

https://www.youtube.com/watch?v=MsBllYu1III

-----------------------------------------------------------------------------------------------------------------------------------------------

Notes Frontend
Notes Frontend is a web app built with React that allows users to create, manage, and delete notes, including attaching audio files to them. It integrates with a backend API for user authentication and note management.

Features
User Authentication: Sign-up, login, and JWT authentication.
Note Management: Create, view, edit, and delete notes.
Audio File Support: Attach and listen to audio files with notes.
Responsive Design: Optimized for desktop, tablet, and mobile.
API Integration: Communicates with a Django backend for note operations.
Tech Stack
Frontend: React.js, Axios, Material-UI
Backend: Django, Django REST Framework
Authentication: JWT
File Storage: Local or cloud storage
Installation
Clone the repository.
Run npm install to install dependencies.
Set the API URL in the .env file.
Start the app with npm start.
Folder Structure
components/: Reusable components.
containers/: Larger view components.
api/: API interaction functions.
hooks/: Custom hooks for reusable logic.
context/: Global state management.
Testing
Run tests with npm test SpeechRecognitionComponent.test.js.

Notes Project Backend
The Notes Project Backend is a Django-based RESTful API that allows user authentication and note management, including audio file uploads. It provides endpoints for creating, updating, deleting, and retrieving notes, while ensuring secure access with JWT authentication.

Features
User registration and authentication.
Create, update, delete, and view notes.
Upload and associate audio files with notes.
Tech Stack
Django & Django REST Framework
PostgreSQL (database)
JWT for authentication
File Storage (local/cloud)
Key Endpoints
POST /api/users/: Register a new user.
POST /api/notes/: Create a note with optional audio file.
GET /api/notes/: Retrieve user notes.
PUT /api/notes/{id}/edit: Edit a note.
DELETE /api/notes/{id}/delete: Delete a note.
Setup
Clone the repo.
Install dependencies: pip install -r requirements.txt
Configure the database and create .env file for secrets.
Run migrations: python manage.py migrate
Start the server: python manage.py runserver 0.0.0.0:8000
Testing
Run with pytest to ensure the functionality is correct.

