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
  note.updatedAt = new Date().toISOString(); // Фиксация времени последнего изменения
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
      note.deleted = true; // Помечаем как удалённое
      note.updatedAt = new Date().toISOString(); // Обновляем время изменения
      await db.put(STORE_NAME, note); // Сохраняем изменения
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
    if (note.deleted) {
      try {
        await fetch(`/api/notes/${note.id}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        await db.delete(STORE_NAME, note.id);
      } catch (error) {
        console.error(`Failed to delete note ${note.id}`, error);
      }
    } else {
      try {
        const method = note.isNew ? 'POST' : 'PUT';
        const url = note.isNew ? '/api/notes/' : `/api/notes/${note.id}/`;

        await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(note),
        });

        await db.delete(STORE_NAME, note.id);
      } catch (error) {
        console.error(`Failed to sync note ${note.id}`, error);
      }
    }
  }
};
