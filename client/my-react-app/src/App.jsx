import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Profile from "./pages/Profile";
import Report from "./pages/Report";
import RankList from "./pages/RankList"; 
import PageNotFound from "./pages/PageNotFound";
import petalsGif from "./gif.gif";
import { AuthContext } from "./helpers/AuthContext";
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [authState, setAuthState] = useState({ username: "", id: 0, status: false });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setAuthState((s) => ({ ...s, status: false }));
      return;
    }

    axios
      .get("/auth/auth", {
        headers: { accessToken: token },
        validateStatus: (s) => s >= 200 && s < 500,
      })
      .then((res) => {
        if (res.status === 200 && res.data?.id) {
          setAuthState({ username: res.data.username, id: res.data.id, status: true });
        } else {
          setAuthState((s) => ({ ...s, status: false }));
        }
      })
      .catch(() => setAuthState((s) => ({ ...s, status: false })));
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false });
  };

  return (
    <div>
      {/* Background falling petals GIF */}
      <img className="falling-petals" src={petalsGif} alt="falling petals" />

      {/* Main app container */}
      <div className="App">
        <AuthContext.Provider value={{ authState, setAuthState }}>
          <Router>
            {/* Navigation Links */}
            <div className="navLinks">
              <Link to="/">Home Page</Link>
              <Link to="/createpost">Create a Post</Link>
              <Link to="/report">Report</Link>
              <Link to="/ranklist">Rank List</Link> {/* New button */}

              {!authState.status ? (
                <>
                  <Link to="/login">Log In</Link>
                  <Link to="/registration">Register</Link>
                </>
              ) : (
                <Link to="/" onClick={logout}>Logout</Link>
              )}
            </div>

            {authState.status && (
              <div className="username-topright">
                <Link to={`/profile/${authState.id}`} className="nav-username">
                  {authState.username}
                </Link>
              </div>
            )}

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/createpost" element={<CreatePost />} />
              <Route path="/post/:id" element={<Post />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/profile/:id"
                element={
                  <Profile
                    loggedInUserId={authState.id}
                    accessToken={localStorage.getItem("accessToken") || ""}
                  />
                }
              />
              <Route path="/report" element={<Report />} />
              <Route path="/ranklist" element={<RankList />} /> {/* New route */}
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Router>
        </AuthContext.Provider>
      </div>
    </div>
  );
}

export default App;
