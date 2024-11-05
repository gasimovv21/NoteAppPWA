import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { ReactComponent as ArrowLeft } from '../assets/arrow-left.svg';
import { ReactComponent as ShareIcon } from '../assets/share.svg';

const NotePage = () => {
    const { id } = useParams();
    const history = useHistory();
    const [note, setNote] = useState({ body: '' });

    useEffect(() => {
        getNote();
    }, [id]);

    const getNote = async () => {
        if (id === 'new') return;
        
        const response = await fetch(`/api/notes/${id}/`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            setNote(data);
        } else if (response.status === 403) {
            alert("You do not have permission to view this note.");
            history.push('/');
        }
    };

    const createNote = async () => {
        await fetch(`/api/notes/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(note)
        });
    };

    const updateNote = async () => {
        await fetch(`/api/notes/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(note)
        });
    };

    const deleteNote = async () => {
        await fetch(`/api/notes/${id}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        history.push('/');
    };

    const handleSubmit = () => {
        if (!note?.body) {
            deleteNote();
        } else if (id === 'new') {
            createNote();
        } else {
            updateNote();
        }
        history.push('/');
    };

    // Делим текст на заголовок и тело
    const splitText = note?.body?.split('\n');
    const title = splitText?.[0] || '';
    const body = splitText?.slice(1).join('\n') || '';

    const shareNote = async () => {
        if (navigator.share) {
            // Преобразование note_id в base64 для безопасной передачи в URL
            const base64Id = btoa(id.toString());
    
            const response = await fetch(`/api/notes/shared/create/${base64Id}/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.ok) {
                const data = await response.json();
                const sharedUrl = `${window.location.origin}/notes/shared/${data.shared_id}`;
                
                navigator.share({
                    title: title || 'Shared Note',
                    text: body,
                    url: sharedUrl
                })
                .then(() => console.log('The note was successfully shared'))
                .catch((error) => console.error('Error when sharing notes:', error));
            } else {
                console.error("Failed to create shared note:", response.statusText);
            }
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
                {id !== 'new' ? (
                    <button onClick={deleteNote}>Delete</button>
                ) : (
                    <button onClick={handleSubmit}>Done</button>
                )}
            </div>
            <textarea
                onChange={(e) => setNote({ ...note, body: e.target.value })}
                value={note?.body || ''}
                style={{ whiteSpace: 'pre-wrap' }} // сохраняем переносы строк
            ></textarea>

            {id !== 'new' && (
                <button onClick={shareNote} className="share-button">
                    <ShareIcon />
                </button>
            )}
        </div>
    );
};

export default NotePage;
