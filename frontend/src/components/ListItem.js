import React from 'react';
import { Link } from 'react-router-dom';

let getTime = (date) => {
    return new Date(date).toLocaleDateString();
};

let getTitle = (note) => {
    let title = note.body.split('\n')[0];
    if (title.length > 45) {
        return title.slice(0, 45);
    }
    return title;
};

let getContent = (note) => {
    let title = getTitle(note);
    let content = note.body.replaceAll('\n', ' ');
    content = content.replaceAll(title, '');

    if (content.length > 45) {
        return content.slice(0, 45) + '...';
    } else {
        return content;
    }
};

const ListItem = ({ note, onDelete }) => {
    return (
        <div className="notes-list-item">
            <Link to={`/note/${note.id}`}>
                <h3 style={{ fontWeight: 'bold' }}>{getTitle(note)}</h3>
                <p><span>Created: {getTime(note.created)}</span> {getContent(note)}</p>
            </Link>
            <button onClick={() => onDelete(note.id)} className="delete-button">Delete</button>
        </div>
    );
};

export default ListItem;
