import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { ReactComponent as ArrowLeft } from '../assets/arrow-left.svg';
import { ReactComponent as AddIcon } from '../assets/add.svg';

const SharedNote = () => {
    const { shared_id } = useParams();
    const history = useHistory();
    const [note, setNote] = useState(null);
    const [author, setAuthor] = useState('');

    useEffect(() => {
        if (shared_id) {
            getSharedNote();
        }
    }, [shared_id]);

    const getSharedNote = async () => {
        try {
            const response = await fetch(`/api/notes/shared/${shared_id}/`);
            if (response.ok) {
                const data = await response.json();
                setNote(data);

                // Запрос к серверу для получения имени автора
                const authorResponse = await fetch(`/api/user/${data.user}/`);
                if (authorResponse.ok) {
                    const authorData = await authorResponse.json();
                    setAuthor(authorData.username); // Устанавливаем имя автора
                } else {
                    console.error("Failed to fetch author information");
                }
            } else {
                alert("Shared note not found or access denied.");
                history.push('/login'); // Перенаправление на страницу входа при ошибке доступа
            }
        } catch (error) {
            console.error("Error fetching shared note:", error);
        }
    };

    const saveNote = async () => {
        try {
            const response = await fetch(`/api/notes/shared/save/${shared_id}/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert("Note saved successfully.");
                history.push('/');
            } else {
                console.error("Failed to save the shared note.");
            }
        } catch (error) {
            console.error("Error saving shared note:", error);
        }
    };

    return (
        <div className="note">
            <div className="note-header">
                {/* Кнопка назад возвращает на домашнюю страницу */}
                <button onClick={() => history.push('/')} className="back-button">
                    <ArrowLeft />
                </button>
                <h3 className="shared-note-title">Shared Note by {author}</h3>
            </div>

            <textarea
                value={note?.body || 'No content available'}
                readOnly
                style={{ width: '100%', height: '200px', marginBottom: '10px' }}
            ></textarea>

            {note?.deadline && (
                <p><strong>Deadline:</strong> {new Date(note.deadline).toLocaleDateString()}</p>
            )}

            <button onClick={saveNote} className="floating-button">
                <AddIcon />
            </button>
        </div>
    );
};

export default SharedNote;
