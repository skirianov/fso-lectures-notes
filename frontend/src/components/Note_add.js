/* eslint-disable react/prop-types */
import React from 'react';

const NoteAdd = ({ newNote, addNote, handleNoteChange }) => (
  <form onSubmit={addNote}>
      <input value={newNote} onChange={handleNoteChange} />
      <button type="submit">save</button>
    </form>
);

export default NoteAdd;
