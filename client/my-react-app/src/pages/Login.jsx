import React, { useState, useContext} from 'react';
import axios from 'axios';
import loginImage from '../login.png';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setAuthState } = useContext(AuthContext);

  const navigate = useNavigate();

  const login = () => {
    const data = { username, password };
    axios.post("http://88.200.63.148:2222/auth/login", data)
      .then((response) => {
        if (response.data.error)  {

          alert(response.data.error)

        } else {

          localStorage.setItem("accessToken", response.data);
          setAuthState(true);
          navigate("/");
        }
      })
      .catch((err) => {
        console.error("Login failed:", err.response?.data || err.message);
      });
  };

  return (
    <div className="createPostPage">
      <div className="formContainer">
 <img src={loginImage} alt="Login" className="formImageTitle" />

        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            className="inputCreatePost"
            type="text"
            placeholder="(Ex. Natasa)"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            className="inputCreatePost"
            type="password"
            placeholder="(Ex. password123)"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <button onClick={login}>Login</button>
      </div>
    </div>
  );
}

export default Login;
