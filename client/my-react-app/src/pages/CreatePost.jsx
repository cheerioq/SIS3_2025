import React from 'react';
import "../App.css";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

function CreatePost() { 
  const initialValues = {
    title: '',
    postText: '',
    username: ''
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    postText: Yup.string().required('Post text is required'),
    username: Yup.string().min(3).max(15).required('Username is required')
  });

  const onSubmit = (data) => {
    axios.post('http://88.200.63.148:2222/posts', data).then((response) => {
      setListOfPosts(response.data);
      console.log('IT WORKED');
    });
  };

  return (
    <div className='createPostPage'>
      <div className="formContainer">
        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
          {() => (
            <Form>
              <label htmlFor="title">Title:</label>
              
              <Field
                id="title"
                name="title"
                placeholder="(Ex. Title)"
                className="inputCreatePost"
              />
              <ErrorMessage name="title" component="span" />

              <label htmlFor="postText">Post:</label>
             
              <Field
                id="postText"
                name="postText"
                placeholder="(Ex. Bitcoin prediction..)"
                className="inputCreatePost"
              />
              <ErrorMessage name="postText" component="span" />

              <label htmlFor="username">Username:</label>
               
              <Field
                id="username"
                name="username"
                placeholder="(Ex. Natasa)"
                className="inputCreatePost"
              />
              <ErrorMessage name="username" component="span" />

              <button type="submit">Create Post</button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default CreatePost;
