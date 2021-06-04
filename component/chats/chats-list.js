import Link from 'next/link';

import classes from './chats-list.module.css';

const ChatsList = ({ rooms, session, openModal }) => {
  return (
    <ul className={classes.list}>
      <h4>Chat Rooms:</h4>
      {rooms.map(room => {
        return (
          <li className={classes.item} key={room._id}>
            {room.roomName}
            <div className={classes.btnContainer}>
              {room.userId === session.id ? (
                <button
                  className={classes.btnDelete}
                  onClick={() => openModal(room._id)}
                >
                  Delete
                </button>
              ) : null}
              <Link href={`/chats/${room.roomName}`}>
                <a className={classes.btnJoin}>Join</a>
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ChatsList;
