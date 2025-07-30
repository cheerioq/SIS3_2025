import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import Post from './pages/Post';
import Login from './pages/Login';
import Registration from './pages/Registration';
import petalsGif from './gif.gif';

function App() {
  return (
    <div>
      {/* Background falling petals GIF */}
      <img className="falling-petals" src={petalsGif} alt="falling petals" />

      {/* Main app container */}
      <div className="App">
        <Router>
          {/* Navigation Links */}
          <div className="navLinks">
            <Link to="/">Home Page</Link>
            <Link to="/createpost">Create a Post</Link>
            <Link to="/login">Log In</Link>
            <Link to="/registration">Resgister</Link>
          </div>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/createpost" element={<CreatePost />} />
            <Route path="/post/:id" element={<Post />} /> 
            <Route path="/registration" element={<Registration />} /> 
            <Route path="/login" element={<Login />} /> 
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
