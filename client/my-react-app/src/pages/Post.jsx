import React, {useEffect, useState, useContext} from 'react'
import {useParams} from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../helpers/AuthContext';

function Post() {
    let {id} = useParams();
const [postObject, setPostObject] = useState({});
const [comments, setComments] = useState([]);
const [newComment, setNewComment] = useState("");
const { authState } = useContext(AuthContext);

    useEffect(() => {
          axios.get(`http://localhost:2222/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
    });

    axios.get(`http://localhost:2222/comments/${id}`).then((response) => {
      setComments(response.data);
    });

  }, []);
  
 const addComment = () => {
  axios.post('http://localhost:2222/comments', {
    commentBody: newComment,
    postId: id
  }, {
    headers: {
      accessToken: localStorage.getItem("accessToken")
    },
  }
).then((response) => {
    if (response.data.error) {
      console.log(response.data.error);
    } else {
      const commentToAdd = response.data; // includes commentBody and username
      setComments([...comments, commentToAdd]);
      setNewComment("");
    }
  });
};

 const deleteComment = (id) => {
  axios.delete(`http://localhost:2222/comments/${id}`, {
    headers: { accessToken: localStorage.getItem("accessToken") },
  })
  .then(() => {
    setComments(prevComments => prevComments.filter(val => val.id !== id));
  })
  .catch(err => {
    console.error(err);
  });
};


    return (
    <div className="postPage">
      <div className="leftSide">
        <div className="title"> {postObject.title} </div>
      <div className="postText"> {postObject.postText} </div>
      <div className="footer"> {postObject.username} </div>
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
    {comments.map((comment, key) => {
      return (
        <div key={key} className="comment">
          <strong>{comment.username}</strong>: {comment.commentBody}
          {authState.username == comment.username && 
          <button onClick={() => deleteComment(comment.id)}>X</button> }
        </div>
      );
    })}
  </div>
</div>
      </div>
    );
}

export default Post;