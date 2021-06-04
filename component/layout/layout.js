import Navigation from './navigation';
import classes from './layout.module.css';

const Layout = ({ children }) => {
  return (
    <div className={classes.container}>
      <Navigation />

      <div className={classes.contentContainer}>{children}</div>
    </div>
  );
};

export default Layout;
