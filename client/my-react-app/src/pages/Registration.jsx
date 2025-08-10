import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import registerImage from '../register.png';

function Registration() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const initialValues = {
    username: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(15).required('Username is required'),
    password: Yup.string().min(6).max(20).required('Password is required'),
  });

  const onSubmit = (data) => {
    axios.post("http://localhost:2222/auth", data)
      .then(() => {
        setSuccess(true);
        // Hide popup and redirect after 2 seconds
        setTimeout(() => {
          setSuccess(false);
          navigate('/login');  // Change '/login' to your actual login route
        }, 2000);
      })
      .catch((err) => {
        console.error(err);
        // Optionally, handle error state here if you want error popups too
      });
  };

  return (
    <div>
      {/* Success popup */}
      {success && (
        <div style={{
          position: 'fixed',
          top: 20,
          right: 20,
          backgroundColor: '#ff4da6',
          color: 'white',
          padding: '15px 25px',
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(255, 77, 166, 0.6)',
          zIndex: 1000,
          fontWeight: 'bold',
        }}>
          Registration Successful!
        </div>
      )}

      <div className='createPostPage'>
        <div className="formContainer">
          <img src={registerImage} alt="Register" className="formImageTitler" />

          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            {() => (
              <Form>
                <label htmlFor="username">Username:</label>
                <Field
                  id="username"
                  name="username"
                  placeholder="(Ex. Natasa)"
                  className="inputCreatePost"
                />
                <ErrorMessage name="username" component="span" />

                <label htmlFor="password">Password:</label>
                <Field
                  id="password"
                  type="password"
                  name="password"
                  placeholder="(Ex. password123)"
                  className="inputCreatePost"
                />
                <ErrorMessage name="password" component="span" />

                <button type="submit">Register</button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default Registration;
