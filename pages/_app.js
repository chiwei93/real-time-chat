import Head from 'next/head';
import { ToastContainer } from 'react-toastify';
import ReactNotification from 'react-notifications-component';
import 'react-toastify/dist/ReactToastify.css';
import 'react-notifications-component/dist/theme.css';
import 'animate.css/animate.min.css';
import { Provider } from 'next-auth/client';

import '../styles/globals.css';
import Layout from '../component/layout/layout';

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <Layout>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <ReactNotification className="container" />
        <ToastContainer />
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;
