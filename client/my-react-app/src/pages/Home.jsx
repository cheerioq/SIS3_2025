import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import likedImg from '../liked.png';
import unlikedImg from '../unliked.png';
import cryptocrybLogo from '../cryptocryb.png';

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const userId = storedUserId ? parseInt(storedUserId) : null;

    console.log("userId from localStorage:", userId);

    axios.get('http://localhost:2222/posts').then((response) => {
      console.log("Posts from backend:", response.data);
      console.log("First post Likes:", response.data[0]?.Likes);
      setListOfPosts(response.data);

      if (!userId) {
        setLikedPosts({});
        return;
      }

      const likedPostsFromBackend = {};
      response.data.forEach(post => {
        likedPostsFromBackend[post.id] = post.Likes.some(
          like => like.userId === userId
        );
      });

      setLikedPosts(likedPostsFromBackend);
    });
  }, []);

  const likeAPost = (postId) => {
    const isLiked = likedPosts[postId];

    axios.post(
      `http://localhost:2222/likes`,
      { postId: postId, like: !isLiked },
      { headers: { accessToken: localStorage.getItem("accessToken") } }
    ).then(() => {
      setLikedPosts((prev) => ({
        ...prev,
        [postId]: !isLiked,
      }));

      setListOfPosts((prevList) =>
        prevList.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              Likes: !isLiked
                ? [...post.Likes, { userId: parseInt(localStorage.getItem("userId")) }]
                : post.Likes.filter(like => like.userId !== parseInt(localStorage.getItem("userId"))),
            };
          }
          return post;
        })
      );
    });
  };

  const isLoggedIn = !!localStorage.getItem("userId");


return (
  <>
    {/* Top logo bar */}
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '10px',
      }}
    >
      <img src={cryptocrybLogo} alt="CryptoCryb" style={{ height: '150px' }} />
    </div>

    {/* Posts container */}
    <div className="posts-container">
      {listOfPosts.slice()
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
  .map((value, key) => {

        console.log(`Post ${value.id} Likes:`, value.Likes ? value.Likes.length : 0);

        return (
          <div className="post" key={key}>
            <div className="title">{value.title}</div>




            <div
              className="body"
              onClick={() => navigate(`/post/${value.id}`)}
            >
              {value.postText}
            </div>

            {value.coinSymbol && (
  <div
    style={{
      color: '#a74174ff',  // pinkish color to match theme
      fontWeight: '300',  // thin font weight (lighter than normal)
      fontStyle: 'italic',   // italic style
      fontSize: '12px',      // smaller font size
      marginBottom: '6px',
    }}
  >
  {value.coinSymbol}
  </div>
)}


            <div
              className="footer"
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '10px',
                paddingRight: '20px',
              }}
            >
              <span style={{ color: 'white' }}>{value.username}</span>

              {isLoggedIn && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    likeAPost(value.id);
                  }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <img
                    src={likedPosts[value.id] ? likedImg : unlikedImg}
                    alt="like button"
                    style={{ width: '20px', height: '20px' }}
                  />
                </button>
              )}

              <label className="like-count" style={{ color: 'white', fontWeight: 'bold' }}>
                {value.Likes ? value.Likes.length : 0}
              </label>
            </div>
          </div>
        );
      })}
    </div>
  </>
);
};

export default Home;
