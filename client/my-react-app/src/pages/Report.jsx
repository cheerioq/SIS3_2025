import React, { useState, useContext } from 'react';
import axios from 'axios';
import reportImage from '../report.png';  // adjust path if needed
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';

function Report() {
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (authState.status) {
      setUsername(authState.username);
    }
  }, [authState]);

  const handleSubmit = () => {
    if (!title.trim() || !username.trim() || !description.trim()) {
      alert('Please fill in all fields');
      return;
    }

    axios.post('http://localhost:2222/report', { title, username, description })
      .then(() => {
        alert('🌸 Report successfully sent! 🌸');
        navigate('/');
      })
      .catch((err) => {
        alert('Error sending report');
        console.error(err);
      });
  };

  return (
    <div className="createPostPage">
      <div
        className="formContainer"
        style={{ maxWidth: '500px', gap: '8px', padding: '20px' }}
      >
        <img
          src={reportImage}
          alt="Report"
          className="formImageTitle"
          style={{
            marginBottom: '15px',
            width: '100%',
            maxHeight: '350px',
            objectFit: 'contain',
          }}
        />

        <label htmlFor="title" style={{ marginBottom: '4px' }}>Report Title:</label>
        <input
          id="title"
          className="inputCreatePost"
          type="text"
          placeholder="Enter the report title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginBottom: '10px' }}
        />

        <label htmlFor="description" style={{ marginBottom: '4px' }}>Report Description:</label>
        <textarea
          id="description"
          className="inputCreatePost"
          placeholder="Describe the problem in detail"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          style={{ resize: 'vertical', padding: '10px', fontSize: '16px', marginBottom: '10px' }}
        />

        <label htmlFor="username" style={{ marginBottom: '4px' }}>Your Username:</label>
        <input
          id="username"
          className="inputCreatePost"
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginBottom: '10px' }}
        />

        <button onClick={handleSubmit}>Report</button>
      </div>
    </div>
  );
}

export default Report;
