import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    axios.get('http://88.200.63.148:2222/posts').then((response) => {
      setListOfPosts(response.data);
    });
  }, []);

  return (
    <div>
      {listOfPosts.map((value, key) => (
        <div
          className="post"
          onClick={() => {
            navigate(`/post/${value.id}`); 
          }}
          key={key}
        >
          <div className="title">{value.title}</div>
          <div className="body">{value.postText}</div>
          <div className="footer">{value.username}</div>
        </div>
      ))}
    </div>
  );
}

export default Home;
