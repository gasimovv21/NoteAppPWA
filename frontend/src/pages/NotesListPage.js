import React, { useState, useEffect } from 'react';
import ListItem from '../components/ListItem';
import AddButton from '../components/AddButton';

const NotesListPage = () => {
    const [notes, setNotes] = useState([]);
    const [error, setError] = useState(null);  // Для отслеживания ошибок

    useEffect(() => {
        getNotes();
    }, []);

    const getNotes = async () => {
        const token = localStorage.getItem('token');  // Получаем токен из localStorage

        try {
            const response = await fetch('/api/notes/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`  // Добавляем токен в заголовок
                }
            });

            if (response.ok) {
                const data = await response.json();
                setNotes(data);
            } else if (response.status === 401) {
                setError('Unauthorized access. Please log in again.');  // Устанавливаем ошибку
                setNotes([]);  // Очищаем список заметок
            } else {
                setError('Failed to fetch notes.');
            }
        } catch (error) {
            setError('An error occurred while fetching notes.');
            console.error(error);
        }
    };

    return (
        <div className="notes">
            <div className="notes-header">
                <h2 className="notes-title">&#9782; Notes</h2>
                <p className="notes-count">{notes.length}</p>
            </div>

            {error ? (  // Отображаем ошибку, если есть
                <p className="error-message">{error}</p>
            ) : (
                <div className="notes-list">
                    {notes.length > 0 ? (
                        notes.map((note, index) => (
                            <ListItem key={index} note={note} />
                        ))
                    ) : (
                        <p>No notes available.</p>
                    )}
                </div>
            )}
            <AddButton />
        </div>
    );
};

export default NotesListPage;
