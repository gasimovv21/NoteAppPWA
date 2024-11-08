import React, { useState, useEffect } from 'react';
import { saveNoteOffline, getAllNotesOffline, syncOfflineNotes, deleteNoteOffline } from '../db';
import ListItem from '../components/ListItem';
import AddButton from '../components/AddButton';

const NotesListPage = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState('');


  useEffect(() => {
    if (navigator.onLine) {
      syncNotes();
      getNotesOnline();
    } else {
      getNotesOffline();
    }
  }, []);

  const syncNotes = async () => {
    await syncOfflineNotes();
    getNotesOnline();
  };

  const getNotesOnline = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/notes/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotes(data);
        data.forEach((note) => saveNoteOffline(note));
      } else {
        setError('Failed to fetch notes.');
      }
    } catch (error) {
      setError('An error occurred while fetching notes.');
    }
  };

  const getNotesOffline = async () => {
    const offlineNotes = await getAllNotesOffline();
    const filteredNotes = offlineNotes.filter((note) => !note.deleted);
    setNotes(filteredNotes);
  };

  const handleDeleteOffline = async (id) => {
    await deleteNoteOffline(id);
    getNotesOffline();
    setNotification('Note deleted successfully!');
    setTimeout(() => setNotification(''), 3000);
  };
  

  return (
    <div className="notes">
      <div className="notes-header">
        <h2 className="notes-title">&#9782; Notes</h2>
        <p className="notes-count">{notes.length}</p>
      </div>
      <div className="notes-list">
        {notes.map((note, index) => (
          <ListItem key={index} note={note} onDelete={handleDeleteOffline} />
        ))}
      </div>

      <AddButton />
      {notification && <div className="notification">{notification}</div>}
    </div>
  );
};

export default NotesListPage;
