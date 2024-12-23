import os
from django.core.files.storage import default_storage
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Note
from .serializers import NoteSerializer, UserCreateSerializer
from rest_framework.views import APIView
from rest_framework import status
from pydub import AudioSegment
from django.core.files.storage import default_storage
from datetime import datetime

current_time = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
class UserCreateView(APIView):
    def post(self, request):
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NoteViewSet(ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Filters notes to only include those belonging to the authenticated user.
        """
        return self.request.user.notes.all()

    def perform_create(self, serializer):
        """
        Associates a new note with the authenticated user and handles audio file uploads.
        """
        audio_file = self.request.FILES.get('audio_file')  # Extract audio file from request

        if audio_file:
            # Define the path where the original file will be saved
            audio_dir = os.path.join(settings.MEDIA_ROOT, 'audio_files')
            original_file_path = os.path.join(audio_dir,  f"{current_time}.mp3")

            # Create the directory if it doesn't exist
            os.makedirs(audio_dir, exist_ok=True)

            # Save the original file to the specified path
            with default_storage.open(original_file_path, 'wb+') as destination:
                for chunk in audio_file.chunks():
                    destination.write(chunk)

            # Convert the audio file to MP3 format
            mp3_file_path = os.path.splitext(original_file_path)[0] + '.mp3'
            audio = AudioSegment.from_file(original_file_path)  # Load the original audio file
            audio.export(mp3_file_path, format='mp3')  # Export as MP3

            # Save the serializer with the associated audio file path
            serializer.save(user=self.request.user, audio_file=mp3_file_path)
        else:
            # Save the note without an audio file
            serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def user_notes(self, request):
        """
        Retrieves all notes belonging to the authenticated user.
        """
        notes = self.get_queryset()
        serializer = self.get_serializer(notes, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='by-user/(?P<user_id>\\d+)')
    def notes_by_user(self, request, user_id=None):
        """
        Retrieves notes for a specific user ID.
        """
        if not user_id:
            return Response({"error": "User ID not provided."}, status=400)

        notes = Note.objects.filter(user_id=user_id)

        if not notes.exists():
            return Response({"message": "No notes found for this user."}, status=404)

        serializer = NoteSerializer(notes, many=True)  # Explicitly use the serializer for clarity
        return Response(serializer.data)

    @action(detail=True, methods=['delete'], url_path='delete')
    def delete_note_by_id(self, request, pk=None):
        """
        Deletes a note by its ID.
        """
        try:
            note = self.get_queryset().get(id=pk)
            note.delete()
            return Response({"message": "Note deleted successfully."}, status=200)
        except Note.DoesNotExist:
            return Response({"error": "Note not found."}, status=404)

    @action(detail=True, methods=['put'], url_path='edit')
    def edit_note_by_id(self, request, pk=None):
        """
        Updates a note's content and optionally its audio file by its ID.
        """
        try:
            note = self.get_queryset().get(id=pk)
        except Note.DoesNotExist:
            return Response({"error": "Note not found."}, status=404)

        # Update the content field of the note
        note.content = request.data.get("content", note.content)
        print('ici')
        print(request.data)

        # Handle the optional audio file update
        new_audio_file = request.FILES.get("audio_file")
        if new_audio_file:
            audio_dir = os.path.join(settings.MEDIA_ROOT, 'audio_files')
            file_path = os.path.join(audio_dir, new_audio_file.name)
            os.makedirs(audio_dir, exist_ok=True)
            with default_storage.open(file_path, 'wb+') as destination:
                for chunk in new_audio_file.chunks():
                    destination.write(chunk)
            note.audio_file = file_path

        # Save the updated note
        note.save()

        # Return the updated note
        serializer = self.get_serializer(note)
        return Response(serializer.data, status=status.HTTP_200_OK)
