import classes from './room-container.module.css';

const RoomContainer = ({ children }) => {
  return <div className={classes.container}>{children}</div>;
};

export default RoomContainer;
