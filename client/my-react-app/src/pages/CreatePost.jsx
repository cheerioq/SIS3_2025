import React from 'react';
import "../App.css";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import postImage from '../post.png';
import { useNavigate } from 'react-router-dom';

function CreatePost() { 
  const navigate = useNavigate();
  const initialValues = {
    title: '',
    postText: '',
    username: '',
    coinSymbol: '',
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    postText: Yup.string().required('Post text is required'),
    username: Yup.string().min(3).max(15).required('Username is required'),
    coinSymbol: Yup.string().required('Please select a cryptocurrency'),
  });

  const onSubmit = (data) => {
    console.log("Submitting data:", data);
    const token = localStorage.getItem("accessToken"); 
    
    axios.post('/posts', data, {
      headers: { accessToken: token }
    }).then(() => {
      navigate('/');
    }).catch(err => {
      console.error(err);
      alert("Failed to create post");
    });
  };

  return (
    <div className='createPostPage'>
      <div className="formContainer">
        <img src={postImage} alt="Post" className="formImageTitlep" />
        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
          {() => (
            <Form>
              <label htmlFor="title">Title:</label>
              <Field id="title" name="title" placeholder="(Ex. Title)" className="inputCreatePost" />
              <ErrorMessage name="title" component="span" />

              <label htmlFor="postText">Post:</label>
              <Field id="postText" name="postText" placeholder="(Ex. Bitcoin prediction..)" className="inputCreatePost" />
              <ErrorMessage name="postText" component="span" />

              <label htmlFor="username">Username:</label>
              <Field id="username" name="username" placeholder="(Ex. Natasa)" className="inputCreatePost" />
              <ErrorMessage name="username" component="span" />

              <label htmlFor="coinSymbol">Cryptocurrency:</label>
              <Field as="select" id="coinSymbol" name="coinSymbol" className="inputCreatePost">
                <option value="">-- Select a Coin --</option>
                <option value="BINANCE:BTCUSDT">Bitcoin (BTC)</option>
                <option value="BINANCE:ETHUSDT">Ethereum (ETH)</option>
                <option value="BINANCE:BNBUSDT">BNB</option>
                <option value="BINANCE:SOLUSDT">Solana (SOL)</option>
              </Field>
              <ErrorMessage name="coinSymbol" component="span" />

              <button type="submit">Create Post</button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default CreatePost;
