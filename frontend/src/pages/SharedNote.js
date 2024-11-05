import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { ReactComponent as AddIcon } from '../assets/add.svg';

const SharedNote = () => {
    const { shared_id } = useParams();  
    const history = useHistory();
    const [note, setNote] = useState(null);

    useEffect(() => {
        console.log("SharedNote component mounted");
        console.log("shared_id:", shared_id);

        if (shared_id) {
            getSharedNote();
        } else {
            console.error("shared_id is missing");
        }
    }, [shared_id]);

    const getSharedNote = async () => {
        try {
            console.log(`Fetching shared note with id: ${shared_id}`);
            const response = await fetch(`/api/notes/shared/${shared_id}/`);
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched shared note data:', data);
                setNote(data);
            } else {
                console.error('Failed to load shared note:', response.status, response.statusText);
                alert("Shared note not found or access denied.");
            }
        } catch (error) {
            console.error("Error fetching shared note:", error);
        }
    };

    const saveNoteForUser = async () => {
        try {
            const response = await fetch(`/api/notes/shared/save/${shared_id}/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert("Note saved to your profile.");
                history.push('/');
            } else {
                console.error("Failed to save note:", response.statusText);
            }
        } catch (error) {
            console.error("Error saving note:", error);
        }
    };

    return (
        <div className="note">
            <h3>Shared Note</h3>
            <textarea 
                value={note?.body || 'No content available'} 
                readOnly 
                style={{ width: "100%", height: "200px" }} 
            ></textarea>
            <button onClick={saveNoteForUser}>
                <AddIcon />
            </button>
        </div>
    );
};

export default SharedNote;
