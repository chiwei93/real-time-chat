import { useRouter } from 'next/router';
import { useState } from 'react';
import axios from 'axios';
import { getSession } from 'next-auth/client';
import Head from 'next/head';

import toastify from '../util/toastify';
import handleErrors from '../util/handleErrors';
import AuthForm from '../component/auth/auth-form';

export default function SignupPage() {
  const router = useRouter();

  //set initial loading state
  const [isLoading, setIsLoading] = useState(false);

  //for handling signup
  const Signup = signupData => {
    //start loading
    setIsLoading(true);

    //make post request to server
    axios
      .post('/api/signup', signupData)
      .then(res => {
        //stop loading
        setIsLoading(false);

        //toast user of succesful sign up
        toastify(true, 'Signed up successfully! You can log in now!');

        //navigate user to login page
        router.push('/');
      })
      .catch(err => {
        //stop loading
        setIsLoading(false);

        //handle errors
        handleErrors(err, 'Failed to sign up! Please try again!');
      });
  };

  return (
    <>
      <Head>
        <title>Sign up | talki</title>
        <meta
          name="description"
          content="talki is a real time chat application. Login in or sign up now to chat with people around the world."
        />
      </Head>
      <AuthForm onSignup={Signup} isSignup={true} isLoading={isLoading} />
    </>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;

  //get session
  const session = await getSession({ req });

  //check if logged in, if true, redirect back to chats page
  if (session) {
    return {
      redirect: {
        destination: '/chats',
        permanent: false,
      },
    };
  }

  return { props: { session } };
}
