import React, { useState, useEffect } from 'react';
import Note from './Note';
import Error from './Error';
import noteService from '../services/notes';



const Footer = () => {
  const footerStyle= {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }

  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2020 made by Sergii Kirianov </em>
    </div>
  )
}

const App = (props) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('a new note ...');
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true);

  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  }

  useEffect(() => {
    noteService
      .getAll()
      .then( initialNotes => setNotes(initialNotes));
  }, []);
  console.log('render', notes.length, 'notes');
    
  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
      id: notes.length + 1,
    }
      noteService
        .create(noteObject)
        .then( newNote => {
          setNotes(notes.concat(newNote));
          setNewNote('');
        })
  }

  const toggleImportance = (id) => {
    const note = notes.find( n => n.id === id);
    const changedNote = { ...note, important: !note.important };
    console.log(changedNote);

    noteService
      .update(id, changedNote)
      .then(updatedNote => {
        setNotes(notes.map(note => note.id !== id ? note : updatedNote))
      })
      .catch( error => {
        setErrorMessage(
          `the note "${note.content}" was already deleted from server`
        )
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
    }

    return (
      <div>
        <h1>Notes</h1>
        <Error message={errorMessage} />
        <div>
            <button onClick={() => setShowAll(!showAll)}>
                show {showAll ? 'important' : 'all'}
            </button>
        </div>
        <ul>
          {notesToShow.map( (note,i) => 
            <Note 
              key={i} 
              note={note}
              toggleImportance={() => toggleImportance(note.id)} />)}
        </ul>
        <form onSubmit={addNote}>
            <input value={newNote} onChange={handleNoteChange} />
            <button type="submit">save</button>
        </form>
        <Footer />
      </div>
    )
  }

export default App;
