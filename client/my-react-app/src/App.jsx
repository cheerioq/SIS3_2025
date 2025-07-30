import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, } from 'react-router-dom';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import Post from './pages/Post';
import Login from './pages/Login';
import Registration from './pages/Registration';
import petalsGif from './gif.gif';
import {AuthContext} from './helpers/AuthContext';
import React, { useState, useEffect, use } from 'react';
import axios from 'axios';


function App() {
  const [authState, setAuthState] = useState(false);

  useEffect(() => {
    axios.get("http://88.200.63.148:2222/auth/auth", {headers: {
      accessToken: localStorage.getItem("accessToken"),
    }}).then((response) => {
      if (response.data.error) {
        setAuthState(false);
      } else {
        setAuthState(true);
      }
    });
  }, []);
 


  return (
    <div>
      {/* Background falling petals GIF */}
      <img className="falling-petals" src={petalsGif} alt="falling petals" />

      {/* Main app container */}
      <div className="App">
        <AuthContext.Provider value={{authState, setAuthState}}>
        <Router>
          {/* Navigation Links */}
          <div className="navLinks">
            <Link to="/">Home Page</Link>
            <Link to="/createpost">Create a Post</Link>

            {!authState && ( 
              <>

            <Link to="/login">Log In</Link>
            <Link to="/registration">Resgister</Link>
            </>
            )}

          </div>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/createpost" element={<CreatePost />} />
            <Route path="/post/:id" element={<Post />} /> 
            <Route path="/registration" element={<Registration />} /> 
            <Route path="/login" element={<Login />} /> 
          </Routes>
        </Router>
        </AuthContext.Provider>
      </div>
    </div>
  );
}

export default App;
