import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { ReactComponent as ArrowLeft } from '../assets/arrow-left.svg';
import { ReactComponent as ShareIcon } from '../assets/share.svg';
import { ReactComponent as MicIcon } from '../assets/mic.svg';
import loadingIcon from '../assets/loading.svg';
import { saveNoteOffline, getAllNotesOffline, syncOfflineNotes } from '../db';

const NotePage = () => {
  const { id } = useParams();
  const history = useHistory();
  const [note, setNote] = useState({ body: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [notification, setNotification] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    window.addEventListener('online', syncNotes);
    window.addEventListener('offline', handleOffline);

    if (navigator.onLine) {
      getNoteOnline();
    } else {
      getNoteOffline();
    }

    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.lang = 'en-US'; // Language
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;

      recognitionInstance.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript;
          }
        }
      
        setNote(prevNote => {
          const updatedBody = (prevNote.body + ' ' + transcript).trim().replace(/\s+/g, ' ');
          return { ...prevNote, body: updatedBody };
        });
      };
      

      recognitionInstance.onend = () => setIsRecording(false);

      setRecognition(recognitionInstance);
    } else {
      console.warn('Speech Recognition API is not supported in this browser.');
    }

    return () => {
      window.removeEventListener('online', syncNotes);
      window.removeEventListener('offline', handleOffline);
    };
  }, [id]);

  const handleOffline = () => setIsOffline(true);

  const syncNotes = async () => {
    setIsOffline(false);
    await syncOfflineNotes();
    getNoteOnline();
  };

  const getNoteOnline = async () => {
    if (id === 'new') return;

    try {
      const response = await fetch(`/api/notes/${id}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setNote(data);
        saveNoteOffline(data);
      }
    } catch (error) {
      console.error('Failed to fetch note:', error);
    }
  };

  const getNoteOffline = async () => {
    const offlineNotes = await getAllNotesOffline();
    const offlineNote = offlineNotes.find((n) => n.id === parseInt(id));
    if (offlineNote) {
      setNote(offlineNote);
    }
  };

  const saveNote = async () => {
    const method = id === 'new' ? 'POST' : 'PUT';
    const url = id === 'new' ? '/api/notes/' : `/api/notes/${id}/`;

    const noteToSave = { ...note, isNew: id === 'new' };

    if (navigator.onLine) {
      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(noteToSave),
        });

        if (response.ok) {
          const updatedNote = await response.json();
          saveNoteOffline(updatedNote);
          setNotification('Note saved successfully!');
        }
      } catch (error) {
        console.error('Failed to save note online:', error);
      }
    } else {
      saveNoteOffline(noteToSave);
      setNotification('Note saved offline. Will sync when online.');
    }

    setTimeout(() => setNotification(''), 3000);
    history.push('/');
  };

  const handleSubmit = () => {
    setIsLoading(true);
    saveNote();
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  };

  const shareNote = async () => {
    if (isOffline) {
      setNotification('You cannot share notes while offline. Please connect to the internet and try again.');
      setTimeout(() => setNotification(''), 3000);
      return;
    }

    if (navigator.share) {
      const base64Id = btoa(id.toString());
      const response = await fetch(`/api/notes/shared/create/${base64Id}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const sharedUrl = `${window.location.origin}/#/notes/shared/${data.shared_id}`;

        navigator.share({
          title: note.body.split('\n')[0] || 'Shared Note',
          text: note.body,
          url: sharedUrl,
        })
          .then(() => console.log('The note was successfully shared'))
          .catch((error) => console.error('Error when sharing notes:', error));
      } else {
        console.error('Failed to create shared note:', response.statusText);
      }
    } else {
      setNotification('Your browser does not support the sharing feature.');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  return (
    <div className="note">
      <div className="note-header">
        <h3>
          <ArrowLeft onClick={handleSubmit} />
        </h3>
        <button onClick={handleSubmit}>Done</button>
      </div>

      {id !== 'new' && (
        <button onClick={shareNote} className="share-button">
          <ShareIcon />
        </button>
      )}

      <textarea
        onChange={(e) => setNote({ ...note, body: e.target.value })}
        value={note?.body || ''}
        style={{ whiteSpace: 'pre-wrap' }}
      ></textarea>

      {isLoading && (
        <div className="loading-overlay">
          <img src={loadingIcon} alt="Loading..." className="loading-icon" />
        </div>
      )}

    <button 
      onClick={toggleRecording} 
      className={`mic-button ${isRecording ? 'recording' : ''}`}
    >
      <MicIcon />
    </button>

      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
    </div>
  );
};

export default NotePage;
