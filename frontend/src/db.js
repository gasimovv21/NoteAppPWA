import { openDB } from 'idb';

const DB_NAME = 'notes-db';
const STORE_NAME = 'notes';

export const initDB = async () => {
  return await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

export const saveNoteOffline = async (note) => {
  const db = await initDB();
  await db.put(STORE_NAME, note);
};

export const getAllNotesOffline = async () => {
  const db = await initDB();
  return await db.getAll(STORE_NAME);
};

export const deleteNoteOffline = async (id) => {
  const db = await initDB();
  const note = await db.get(STORE_NAME, id);
  if (note) {
    note.deleted = true;
    await db.put(STORE_NAME, note);
  }
};


export const clearStore = async () => {
  const db = await initDB();
  db.clear(STORE_NAME);
};


export const syncOfflineNotes = async () => {
    const db = await initDB();
    const notes = await db.getAll(STORE_NAME);
  
    for (const note of notes) {
      const method = note.deleted ? 'DELETE' : note.isNew ? 'POST' : 'PUT';
      const url = method === 'DELETE' ? `/api/notes/${note.id}/` : note.isNew ? '/api/notes/' : `/api/notes/${note.id}/`;
    
      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: method !== 'DELETE' ? JSON.stringify(note) : undefined,
        });
    
        if (response.ok) {
          await db.delete(STORE_NAME, note.id);
        } else {
          console.error(`Failed to ${method} note with id ${note.id}`);
        }
      } catch (error) {
        console.error(`Failed to sync note ${note.id}:`, error);
      }
    }
};
