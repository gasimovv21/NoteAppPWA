import { openDB } from 'idb';

const dbPromise = openDB('notes-store', 1, {
    upgrade(db) {
        if (!db.objectStoreNames.contains('notes')) {
            db.createObjectStore('notes', { keyPath: 'id' });
        }
    },
});

// Функция для сохранения массива заметок в IndexedDB
export async function saveNotesToDB(notes) {
    const db = await dbPromise;
    const tx = db.transaction('notes', 'readwrite');
    const store = tx.objectStore('notes');
    for (const note of notes) {
        await store.put(note);  // Ждем завершения каждой операции записи
    }
    await tx.done;  // Дожидаемся завершения транзакции
}

// Функция для получения всех заметок из IndexedDB
export async function getNotesFromDB() {
    const db = await dbPromise;
    const tx = db.transaction('notes', 'readonly');
    const store = tx.objectStore('notes');
    const notes = await store.getAll();  // Получаем все заметки
    await tx.done;  // Завершаем транзакцию
    return notes;
}

// Функция для получения одной заметки из IndexedDB
export async function getNoteFromDB(id) {
    const db = await dbPromise;
    const tx = db.transaction('notes', 'readonly');
    const store = tx.objectStore('notes');
    const note = await store.get(id);  // Получаем заметку по ID
    await tx.done;  // Завершаем транзакцию
    return note;
}

// Функция для удаления заметки из IndexedDB
export async function deleteNoteFromDB(id) {
    const db = await dbPromise;
    const tx = db.transaction('notes', 'readwrite');
    const store = tx.objectStore('notes');
    await store.delete(id);  // Удаляем заметку
    await tx.done;  // Завершаем транзакцию
}


export async function syncNotesWithServer() {
    const db = await dbPromise;

    // Получение локальных заметок
    const localNotes = await db.getAll('notes');

    // Получение заметок с сервера
    const response = await fetch('/api/notes/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch notes from server');
    }

    const serverNotes = await response.json();

    const tx = db.transaction('notes', 'readwrite');
    const store = tx.objectStore('notes');

    // Очистка локальных заметок и обновление с сервера
    await store.clear();
    for (const note of serverNotes) {
        await store.put(note);
    }

    await tx.done;
}
