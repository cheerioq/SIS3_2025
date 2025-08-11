import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../helpers/AuthContext';

import cryptocoinImg from '../cryptocoin.png';

import {
  DndContext,
  useDraggable,
} from '@dnd-kit/core';

function DraggableWindow({ children, position, setPosition }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'draggable-window',
  });

  React.useEffect(() => {
    if (transform) {
      setPosition({ x: transform.x, y: transform.y });
    }
  }, [transform, setPosition]);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        position: 'fixed',
        bottom: '60px',
        right: '20px',
        width: '320px',
        height: '280px',
        backgroundColor: '#fff0f6',
        border: '2px solid #e91e63',
        borderRadius: '8px',
        boxShadow: '0 0 15px #e91e63',
        zIndex: 1000,
        padding: '10px',
        cursor: 'move',
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        touchAction: 'none',
      }}
    >
      {children}
    </div>
  );
}

function Post() {
  let { id } = useParams();
  const navigate = useNavigate();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { authState } = useContext(AuthContext);
  const [showChart, setShowChart] = useState(false);


  const [chartPosition, setChartPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    axios.get(`http://localhost:2222/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
    });

    axios.get(`http://localhost:2222/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  }, [id]);

  const addComment = () => {
    axios
      .post(
        'http://localhost:2222/comments',
        {
          commentBody: newComment,
          postId: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem('accessToken'),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          const commentToAdd = response.data; 
          setComments([...comments, commentToAdd]);
          setNewComment('');
        }
      });
  };

  const deleteComment = (id) => {
    axios
      .delete(`http://localhost:2222/comments/${id}`, {
        headers: { accessToken: localStorage.getItem('accessToken') },
      })
      .then(() => {
        setComments((prevComments) => prevComments.filter((val) => val.id !== id));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const coinChartSymbols = {
    'BINANCE:BTCUSDT': 'BTCUSDT',
    'BINANCE:ETHUSDT': 'ETHUSDT',
    'BINANCE:BNBUSDT': 'BNBUSDT',
    'BINANCE:SOLUSDT': 'SOLUSDT',
  };

  const chartSymbol = coinChartSymbols[postObject.coinSymbol] || 'BTCUSDT';


  const toggleChart = () => {
    if (showChart) {
      
      setChartPosition({ x: 0, y: 0 });
      setShowChart(false);
    } else {
      setShowChart(true);
    }
  };

  return (
    <div className="postPage" style={{ position: 'relative' }}>
      <div className="leftSide" style={{ position: 'relative' }}>
        <div className="title">{postObject.title}</div>
        <div className="postText">{postObject.postText}</div>
        <div className="footer">{postObject.username}</div>

        {postObject.coinSymbol && (
          <img
            src={cryptocoinImg}
            alt="Coin Chart"
            onClick={toggleChart}
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              borderRadius: '5px',
              border: '2px solid #e91e63',
              boxShadow: '0 0 8px #e91e63',
            }}
            title="Show Coin Chart"
          />
        )}
      </div>

      <div className="rightSide">
        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="Comment..."
            autoComplete="off"
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
          />
          <button onClick={addComment}>Send</button>
        </div>

        <div className="listOfComments">
          {comments.map((comment, key) => (
            <div key={key} className="comment">
              <span
                style={{
                  fontWeight: 'bold',
                  color: '#e91e63',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
                onClick={() => navigate(`/profile/${comment.userId}`)}
                title={`Go to ${comment.username}'s profile`}
              >
                {comment.username}
              </span>
              : {comment.commentBody}
              {authState.username === comment.username && (
                <button
                  onClick={() => deleteComment(comment.id)}
                  style={{
                    fontSize: '12px',
                    padding: '2px 6px',
                    minWidth: '30px',
                    height: '30px',
                    lineHeight: '16px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    marginLeft: '8px',
                  }}
                >
                  X
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {showChart && (
        <DndContext>
          <DraggableWindow position={chartPosition} setPosition={setChartPosition}>
            <div
              style={{
                fontWeight: 'bold',
                marginBottom: '8px',
                color: '#e91e63',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>{postObject.coinSymbol} Chart</span>
            </div>
            <iframe
              title="TradingView Chart"
              src={`https://s.tradingview.com/widgetembed/?symbol=${chartSymbol}&interval=D&theme=light&style=1&locale=en&toolbarbg=fff0f6&enable_publishing=false&hide_top_toolbar=true&hide_legend=true&save_image=false`}
              style={{ width: '100%', height: '180px', border: 'none', borderRadius: '6px' }}
              scrolling="no"
            />
          </DraggableWindow>
        </DndContext>
      )}
    </div>
  );
}

export default Post;
