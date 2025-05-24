// REFERENCE SOLUTION - Do not distribute to students
// src/components/NoteEditor.tsx
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { saveNote } from '../services/noteService';
import { Note } from '../types/Note';

interface NoteEditorProps {
  initialNote?: Note;
  onSave?: (note: Note) => void;
}

const emptyNote: Note = {
  id: uuidv4(),
  title: '',
  content: '',
  lastUpdated: Date.now(),
};

const NoteEditor: React.FC<NoteEditorProps> = ({ initialNote, onSave }) => {
  const [note, setNote] = useState<Note>(() => {
    return initialNote || emptyNote;
  });

  // TODO: create state for saving status
  const [saveStatus, setSaveStatus] = useState<boolean>(false);
  // TODO: createState for error handling
  const [error, setError] = useState<Error | null>(null);

  // TODO: Update local state when initialNote changes in a useEffect (if editing an existing note)
  // This effect runs when the component mounts or when initialNote changes
  // It sets the note state to the initialNote if provided, or resets to a new empty note, with a unique ID
  useEffect(() => {
    const emptyNote: Note = {
      id: uuidv4(),
      title: '',
      content: '',
      lastUpdated: Date.now(),
    };

    setNote(initialNote ?? emptyNote);
  }, [initialNote]);

  //TODO: on form submit create a "handleSubmit" function that saves the note to Firebase and calls the onSave callback if provided
  // This function should also handle any errors that occur during saving and update the error state accordingly
  const onHandleSubmit = async (note: Note) => {
    try {
      setSaveStatus(true);
      if (!note.content || !note.title)
        throw new Error('This note is empty; please fill out the note');

      await saveNote(note);

      if (onSave) {
        onSave(note);
        setNote(emptyNote);
      }
      setError(null);
    } catch (e) {
      setError(e as Error);
    } finally {
      setSaveStatus(false);
    }
  };

  // TODO: for each form field; add a change handler that updates the note state with the new value from the form
  // TODO: disable fields and the save button while saving is happening
  // TODO: for the save button, show "Saving..." while saving is happening and "Save Note" when not saving
  // TODO: show an error message if there is an error saving the note
  return (
    <form className="note-editor">
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={note.title}
          required
          placeholder="Enter note title"
          onChange={(input) => setNote({ ...note, title: input.target.value })}
        />
      </div>
      <div className="form-group">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          value={note.content}
          rows={5}
          required
          placeholder="Enter note content"
          onChange={(input) => setNote({ ...note, content: input.target.value })}
        />
      </div>
      {error && (
        <div className="error-message">
          <p>ERROR: Unable to save message.</p>
          <p>{error.message}</p>
        </div>
      )}
      <div className="form-actions">
        <button type="submit" disabled={saveStatus} onClick={() => onHandleSubmit(note)}>
          {initialNote
            ? saveStatus
              ? 'Updating...'
              : 'Update Note'
            : saveStatus
              ? 'Saving...'
              : 'Save Note'}
        </button>
      </div>
    </form>
  );
};

export default NoteEditor;
