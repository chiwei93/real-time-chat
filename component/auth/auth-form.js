import { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/client';

import toastify from '../../util/toastify';
import classes from './auth-form.module.css';

const AuthForm = ({ onSignup, isSignup, isLoading }) => {
  const router = useRouter();

  //set initial state
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const inProgress = isSignup ? isLoading : isLoginLoading;

  //for handling input change
  const onFormInputChange = e => {
    const target = e.target;
    const name = target.name;

    //disable the username error if the username is not empty
    if (name === 'username') {
      if (usernameError) {
        if (target.value.length > 0) {
          setUsernameError(false);
        }
      }
    }

    //disable the password error if the password is at least 8 characters long
    if (name === 'password') {
      if (passwordError) {
        if (target.value.length >= 8) {
          setPasswordError(false);
        }
      }
    }

    //update the form state
    setForm({ ...form, [name]: e.target.value });
  };

  //for handling form submission
  const onFormSubmit = e => {
    e.preventDefault();

    const errors = [];

    //validate form
    //check if username is empty
    if (form.username.length === 0) {
      errors.push('username');
      setUsernameError(true);
    }

    //check if password has at least 8 characters
    if (form.password.length < 8) {
      errors.push('password');
      setPasswordError(true);
    }

    //don't submit when there are errors
    if (errors.length > 0) {
      return;
    }

    //make api request
    if (isSignup) {
      //signup if true
      onSignup(form);
    } else {
      //start loading
      setIsLoginLoading(true);

      //login if false
      signIn('credentials', {
        redirect: false,
        ...form,
      }).then(result => {
        //stop loading
        setIsLoginLoading(false);

        //if there is no error
        if (!result.error) {
          //navigate user to chats
          router.push('/chats');

          //toast user
          toastify(true, 'Logged in successfully!');
        } else {
          //if got errors, toast user of the error
          toastify(false, result.error);
        }
      });
    }
  };

  return (
    <form onSubmit={onFormSubmit} className={classes.form}>
      <h2>{isSignup ? 'Sign Up' : 'Log In'}</h2>

      <p className={classes.heading}>
        {isSignup
          ? 'Register now to start chatting with your friends and family'
          : 'Login now to enjoy chatting immediately'}
      </p>

      <div className={classes.control}>
        <input
          type="text"
          name="username"
          onChange={onFormInputChange}
          value={form.username}
          autoComplete="off"
          id="username"
          placeholder="Enter username"
        />

        {usernameError && (
          <p className={classes.errorMsg}>Please enter an username</p>
        )}
      </div>

      <div className={classes.control}>
        <input
          type="password"
          name="password"
          onChange={onFormInputChange}
          value={form.password}
          autoComplete="off"
          id="password"
          placeholder="Enter password"
        />

        {passwordError && (
          <p className={classes.errorMsg}>
            A password should be at least 8 characters long
          </p>
        )}
      </div>

      <div className={classes.btnContainer}>
        <button>
          {isSignup && inProgress && 'Signing up...'}
          {isSignup && !inProgress && 'Sign Up'}
          {!isSignup && inProgress && 'Logging In...'}
          {!isSignup && !inProgress && 'Log In'}
        </button>
      </div>
    </form>
  );
};

export default AuthForm;
