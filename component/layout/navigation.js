import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/client';

import classes from './navigation.module.css';

const Navigation = () => {
  const router = useRouter();

  //check if user is sign in or not
  const [session, loading] = useSession();

  //for handling logout
  const onLogoutBtnClick = () => {
    //delete the cookie and redirect back to the login page
    signOut({ callbackUrl: '/' });
  };

  return (
    <nav className={classes.nav}>
      <div className={classes.logoContainer}>
        <Link href={session ? '/chats' : '/'}>
          <a className={classes.logo}>talki</a>
        </Link>
      </div>

      <ul>
        {router.pathname !== '/' && !session && !loading && (
          <li className={classes.item}>
            <Link href="/">
              <a className={`${classes.link} ${classes.login}`}>Login</a>
            </Link>
          </li>
        )}

        {router.pathname !== '/signup' && !session && !loading && (
          <li className={classes.item}>
            <Link href="/signup">
              <a className={`${classes.link} ${classes.signup}`}>Signup</a>
            </Link>
          </li>
        )}

        {session && !loading && (
          <li className={classes.item}>
            <Link href="/chats">
              <a className={`${classes.link} ${classes.signup}`}>Chats</a>
            </Link>
          </li>
        )}

        {session && !loading && (
          <li className={classes.item}>
            <button
              className={`${classes.link} ${classes.logout}`}
              onClick={onLogoutBtnClick}
            >
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
