import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { ReactComponent as ArrowLeft } from '../assets/arrow-left.svg';
import { ReactComponent as ShareIcon } from '../assets/share.svg';
import loadingIcon from '../assets/loading.svg';

const NotePage = () => {
    const { id } = useParams();
    const history = useHistory();
    const [note, setNote] = useState({ body: '', deadline: '' });
    const [isLoading, setIsLoading] = useState(false);

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
            body: JSON.stringify({ body: note.body, deadline: note.deadline || null })
        });
    };

    const updateNote = async () => {
        await fetch(`/api/notes/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ body: note.body, deadline: note.deadline || null })
        });
    };

    const deleteNote = async () => {
        setIsLoading(true);
        await fetch(`/api/notes/${id}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        setTimeout(() => {
            setIsLoading(false);
            history.push('/');
        }, 500);
    };

    const handleSubmit = () => {
        setIsLoading(true);
        if (!note?.body) {
            deleteNote();
        } else if (id === 'new') {
            createNote();
        } else {
            updateNote();
        }
        setTimeout(() => {
            setIsLoading(false);
            history.push('/');
        }, 500);
    };

    const shareNote = async () => {
        if (navigator.share) {
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
                const sharedUrl = `${window.location.origin}/#/notes/shared/${data.shared_id}`;
                
                navigator.share({
                    title: note.body.split('\n')[0] || 'Shared Note',
                    text: note.body,
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

            <input
                type="date"
                value={note.deadline || ''}
                onChange={(e) => setNote({ ...note, deadline: e.target.value })}
                className="date-picker"
            />

            {isLoading && (
                <div className="loading-overlay">
                    <img src={loadingIcon} alt="Loading..." className="loading-icon" />
                </div>
            )}
        </div>
    );
};

export default NotePage;
