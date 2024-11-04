import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { ReactComponent as ArrowLeft } from '../assets/arrow-left.svg';
import { ReactComponent as ShareIcon } from '../assets/share.svg';

const NotePage = () => {
    const { id } = useParams();
    const history = useHistory();
    const [note, setNote] = useState(null);

    useEffect(() => {
        getNote();
    }, [id]);

    const getNote = async () => {
        if (id === 'new') return;
        
        const response = await fetch(`/api/notes/${id}/`);
        const data = await response.json();
        setNote(data);
    };

    const createNote = async () => {
        await fetch(`/api/notes/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(note)
        });
    };

    const updateNote = async () => {
        await fetch(`/api/notes/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(note)
        });
    };

    const deleteNote = async () => {
        await fetch(`/api/notes/${id}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        history.push('/');
    };

    const handleSubmit = () => {
        if (id !== 'new' && !note.body) {
            deleteNote();
        } else if (id !== 'new') {
            updateNote();
        } else if (id === 'new' && note) {
            createNote();
        }
        history.push('/');
    };

    // Функция для шаринга заметки
    const shareNote = () => {
        if (navigator.share) {
            navigator.share({
                title: `Заметка: ${note.title || 'Без названия'}`,
                text: note.body,
                url: window.location.href
            })
            .then(() => console.log('The note was successfully shared'))
            .catch((error) => console.error('Error when sharing notes:', error));
        } else {
            alert("Your browser does not support the sharing feature.");
        }
    };

    return (
        <div className="note">
            <div className="note-header">
                <h3>
                    <ArrowLeft onClick={handleSubmit} />
                </h3>
                <button onClick={handleSubmit}>Save</button>
            </div>
            <textarea
                onChange={(e) => setNote({ ...note, body: e.target.value })}
                value={note?.body}
            ></textarea>

            {/* Кнопка для шаринга с иконкой */}
            <button onClick={shareNote} className="share-button">
                <ShareIcon />
            </button>
        </div>
    );
};

export default NotePage;
