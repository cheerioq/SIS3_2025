import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom';
import axios from 'axios';

function Post() {
    let {id} = useParams();
const [postObject, setPostObject] = useState({});
const [comments, setComments] = useState([]);
const [newComment, setNewComment] = useState("");

    useEffect(() => {
          axios.get(`http://88.200.63.148:2222/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
    });

    axios.get(`http://88.200.63.148:2222/comments/${id}`).then((response) => {
      setComments(response.data);
    });

  }, []);
  
 const addComment = () => {
  axios.post('http://88.200.63.148:2222/comments', {
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
        </div>
      );
    })}
  </div>
</div>
      </div>
    );
}

export default Post;