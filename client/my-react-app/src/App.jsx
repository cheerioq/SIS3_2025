import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import petalsGif from './gif.gif';

function App() {
  const [listOfPosts, setListOfPosts] = useState([]);

  useEffect(() => {
    axios.get("http://88.200.63.148:2222/posts").then((response) => {
      setListOfPosts(response.data);
    });
  }, []);

  return (
    <div>
      {/* Background falling petals GIF */}
       <img className="falling-petals" src={petalsGif} alt="falling petals" />


      {/* Main app container */}
      <div className="App">
        {listOfPosts.map((value, key) => (
          <div className="post" key={key}>
            <div className="title">{value.title}</div>
            <div className="body">{value.postText}</div>
            <div className="footer">{value.username}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
