// src/components/NoteList.tsx
import React, { useEffect, useState } from 'react';

import { subscribeToNotes } from '../services/noteService';
import { Note, Notes } from '../types/Note';
import NoteItem from './NoteItem';

interface NoteListProps {
  onEditNote?: (note: Note) => void;
}
// TODO: remove the eslint-disable-next-line when you implement the onEditNote handler
const NoteList: React.FC<NoteListProps> = ({ onEditNote }) => {
  // TODO: load notes using subscribeToNotes from noteService, use useEffect to manage the subscription; try/catch to handle errors (see lab 3)
  // TODO: handle unsubscribing from the notes when the component unmounts
  // TODO: manage state for notes, loading status, and error message
  // TODO: display a loading message while notes are being loaded; error message if there is an error

  const [notes, setNotes] = useState<Notes>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      setLoading(true);

      const unsubscribe = subscribeToNotes(
        (listOfNotes: Notes) => {
          setNotes(listOfNotes);
          setLoading(false);
        },
        (error: Error) => {
          setError(error);
        },
      );
      return () => {
        unsubscribe();
      };
    } catch (e) {
      setError(e as Error);
    }
  }, []);

  return (
    <>
      {error && (
        <div className="error-message">
          <p>error/i</p>
        </div>
      )}
      <div className="note-list">
        <h2>Notes</h2>
        {loading ? (
          <p>Loading notes...</p>
        ) : Object.values(notes).length === 0 ? (
          <p>No notes yet. Create your first note!</p>
        ) : (
          <div className="notes-container">
            {Object.values(notes)
              // Sort by lastUpdated (most recent first)
              .sort((a, b) => b.lastUpdated - a.lastUpdated)
              .map((note) => (
                <NoteItem key={note.id} note={note} onEdit={onEditNote} />
              ))}
          </div>
        )}
      </div>
    </>
  );
};

export default NoteList;
