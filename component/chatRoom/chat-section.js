import { FaTimes, FaRegPaperPlane } from 'react-icons/fa';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import classes from './chat-section.module.css';

const ChatSection = ({
  onSend,
  messages,
  usersCount,
  currentUser,
  roomName,
}) => {
  //set initial state
  const [message, setMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      //scroll to the bottom of the chat
      document
        .getElementById('chat_bottom')
        .scrollIntoView({ behavior: 'smooth' });
    }

    return () => {
      mounted = false;
    };
  }, [messages]);

  //send button
  const onFormSubmit = e => {
    //prevent loading
    e.preventDefault();

    //validation check
    if (message.length === 0) {
      return;
    }

    //send messages
    onSend(message);

    //empty textarea
    setMessage('');
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.chatInfo}>
          <h4>{roomName}</h4>
          <p>{usersCount} people online</p>
        </div>
        <Link href="/chats">
          <a className={classes.btnClose}>
            <FaTimes />
          </a>
        </Link>
      </div>

      <ul className={classes.chat}>
        {messages.map((msg, index) => {
          if (msg.username === currentUser) {
            return (
              <li className={`${classes.chatItem} ${classes.me}`} key={index}>
                <p className={classes.name}>{msg.username}</p>
                <p className={classes.message}>{msg.message}</p>
              </li>
            );
          } else {
            return (
              <li className={`${classes.chatItem}`} key={index}>
                <p className={classes.name}>{msg.username}</p>
                <p className={classes.message}>{msg.message}</p>
              </li>
            );
          }
        })}
        <div id="chat_bottom"></div>
      </ul>

      <div className={classes.form}>
        <div className={classes.inputContainer}>
          <textarea
            placeholder="Enter message"
            rows="5"
            onChange={e => setMessage(e.target.value)}
            value={message}
          />
        </div>

        <div className={classes.sendContainer}>
          <button onClick={onFormSubmit}>
            <FaRegPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
