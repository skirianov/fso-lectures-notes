/* eslint-disable react/prop-types */
import React from 'react';
import loginService from '../services/login';
import noteService from '../services/notes';


const Login = ({ setErrorMessage, setUser, setUsername, setPassword, username, password }) => {

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService({
        username,
        password,
      });

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      noteService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setErrorMessage('Wrong credentials');
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000);
    }
  }
  return (
  <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
            />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
            />
      </div>
      <button type="submit">Login</button>
    </form>
)};

export default Login;
