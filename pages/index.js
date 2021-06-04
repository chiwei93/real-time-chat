import { getSession } from 'next-auth/client';
import Head from 'next/head';

import AuthForm from '../component/auth/auth-form';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Login | talki</title>
        <meta
          name="description"
          content="talki is a real time chat application. Login in or sign up now to chat with people around the world."
        />
      </Head>
      <AuthForm isSignup={false} />
    </>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;

  //get session
  const session = await getSession({ req });

  //check if session exist, if true redirect back to chats page
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
