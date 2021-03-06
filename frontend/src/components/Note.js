/* eslint-disable react/prop-types */
import React from 'react'

// eslint-disable-next-line react/prop-types
const Note = ({ note, toggleImportance }) => {
  // eslint-disable-next-line react/prop-types
  const label = note.important
    ? 'make not important'
    : 'make important'

  return (
    <div>
      <li className='note'>
        {note.content}
        <button onClick={toggleImportance}>{label}</button>
      </li>
    </div>
  )
}

export default Note