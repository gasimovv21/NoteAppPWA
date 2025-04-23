
# NoteApp

NoteApp is a Progressive Web App (PWA) for creating and managing notes, developed using **React** on the frontend and **Django Rest Framework** on the backend. The app supports both online and offline usage and allows users to share notes via unique links.

## Key Features

- **User Registration and Authentication**: Users can register and log in to manage their personal notes.
- **Note Management**: Create, edit, and delete notes easily.
- **Offline Support**: 
  - Users can create, edit, and delete notes while offline.
  - All changes are synchronized with the server once the device reconnects to the internet.
- **PWA Support**:
  - The app can be installed on a device as a Progressive Web App.
  - Includes resource caching and background data synchronization.
- **Speech Recognition**: Input text using voice commands through the Web Speech API.
- **Note Sharing**: Share notes using the **Web Share API** with a generated unique link.

## Technologies

- **Frontend**: React, Service Workers, PWA
- **Backend**: Django, Django Rest Framework
- **Database**: SQLite (default), with support for other databases via Django settings
- **IndexedDB (IDB)**: For local data storage in offline mode
- **Web Speech API**: For speech-to-text functionality
- **Web Share API**: For sharing notes via the device's native sharing options

## Installation and Setup

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/noteapp.git
   cd noteapp
   ```

2. **Set up and activate a virtual environment (for Django)**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```

3. **Install backend dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations**:
   ```bash
   python manage.py migrate
   ```

5. **Start the Django development server**:
   ```bash
   python manage.py runserver
   ```

6. **Install frontend dependencies**:
   Navigate to the frontend directory and install dependencies:
   ```bash
   cd NoteAppPWA-main
   cd frontend
   npm install
   npm run build
   ```

7. **Start the React development server**:
   ```bash
   npm start
   ```

8. **PWA**:
   Ensure your browser supports PWA, and you can install the app locally.

## PWA Configuration

The project includes configuration for PWA in `manifest.json` and `service-worker.js`:
- **`manifest.json`** — defines metadata for the app.
- **`service-worker.js`** — caches resources for offline access and handles background data synchronization.

## Usage

### Creating and Managing Notes
1. Log in or register to start managing your notes.
2. Create, edit, or delete notes through the user-friendly interface.
3. Share notes via unique links using the Web Share API.

### Offline Mode
- All data is stored locally using IndexedDB when offline.
- Upon reconnecting to the internet, the app automatically synchronizes data with the server.

### Speech Recognition
- Click the microphone button in the bottom-right corner to input text using voice commands.

### Web Share
- Share your notes with others by generating a unique link. When a note is shared, the app leverages the device’s **Web Share API** for seamless sharing across platforms.

## API Endpoints

- `POST /api/notes/` — Create a new note.
- `GET /api/notes/` — Retrieve a list of all notes.
- `GET /api/notes/<id>/` — Retrieve a specific note by ID.
- `PUT /api/notes/<id>/` — Update a specific note.
- `DELETE /api/notes/<id>/` — Delete a specific note.
- `POST /api/notes/shared/create/<id>/` — Generate a unique link for sharing a note.


## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

---

Made with ❤️ using Django and React.
