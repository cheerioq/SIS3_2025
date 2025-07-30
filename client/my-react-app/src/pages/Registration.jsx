import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import registerImage from '../register.png';

function Registration() {

    const initialValues = {
        username: '',
        password: '',
      };
    
      const validationSchema = Yup.object().shape({

        username: Yup.string().min(3).max(15).required('Username is required'),
        password: Yup.string().min(6).max(20).required('Password is required'),

      });

const onSubmit = (data) => {

    axios.post("http://88.200.63.148:2222/auth", data).then(() => {
        console.log(data);
    });
};

  return (
    <div>
        {""}
        <div className='createPostPage'>
      <div className="formContainer">

        <img src={registerImage} alt="Register" className="formImageTitler" />

            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
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
  )};

export default Registration;