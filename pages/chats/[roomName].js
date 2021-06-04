import axios from 'axios';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client';
import Pusher from 'pusher-js';
import { useEffect, useState } from 'react';
import { store } from 'react-notifications-component';
import Head from 'next/head';

import ChatSection from '../../component/chatRoom/chat-section';
import RoomContainer from '../../component/chatRoom/room-container';
import UsersSection from '../../component/chatRoom/users-section';

const RoomPage = ({ session, room }) => {
  const router = useRouter();

  const { roomName } = router.query;

  //initiatlise pusher
  const pusher = new Pusher(process.env.NEXT_PUBLIC_key, {
    cluster: 'ap1',
    authEndpoint: '/api/pusher/auth',
  });

  //set initial states
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      //subscribe to the channel
      const channel = pusher.subscribe(`presence-${roomName}`);

      //when the successfully subscribe to the channel
      channel.bind('pusher:subscription_succeeded', members => {
        //update the users' count
        setUsersCount(members.count);

        const usersArr = [];

        members.each(member => {
          usersArr.push(member);
        });

        //update the users in the chat
        setUsers(usersArr);
      });

      //when a new member joins the chat
      channel.bind('pusher:member_added', member => {
        //increase the users' count
        setUsersCount(prevState => prevState + 1);

        //update the users' array
        setUsers(prevState => [...prevState, member]);

        //notify users
        store.addNotification({
          title: 'Notification',
          message: `${member.info.username} joined the chat`,
          type: 'info',
          insert: 'top',
          container: 'top-center',
          animationIn: ['animate__animated', 'animate__bounceIn'],
          animationOut: ['animate__animated', 'animate__flipOutX'],
          dismiss: {
            duration: 3000,
            onScreen: true,
          },
        });
      });

      //when a member leaves the chat
      channel.bind('pusher:member_removed', member => {
        const newUsersArr = [...users];

        const removedUserIndex = newUsersArr.findIndex(
          user => user.id === member.id
        );

        newUsersArr.splice(removedUserIndex, 1);

        //update the states
        setUsers(newUsersArr);
        setUsersCount(prevState => prevState - 1);

        store.addNotification({
          title: 'Notification',
          message: `${member.info.username} left the chat`,
          type: 'info',
          insert: 'top',
          container: 'top-center',
          animationIn: ['animate__animated', 'animate__bounceIn'],
          animationOut: ['animate__animated', 'animate__flipOutX'],
          dismiss: {
            duration: 3000,
            onScreen: true,
          },
        });
      });

      //when a member send a message in the chat
      channel.bind('update-messages', message => {
        setMessages(prevState => [...prevState, message]);
      });
    }

    //when user navigate away from the page
    return () => {
      pusher.unsubscribe(`presence-${roomName}`);
      mounted = false;
    };
  }, [roomName]);

  //for handling sending messages
  const sendMessage = message => {
    axios.post(`/api/chats/${roomName}`, {
      username: session.user.name,
      message: message,
    });
  };

  return (
    <>
      <Head>
        <title>{room} | talki</title>
        <meta
          name="description"
          content="talki is a real time chat application. Login in or sign up now to chat with people around the world."
        />
      </Head>
      <RoomContainer>
        <ChatSection
          onSend={sendMessage}
          messages={messages}
          usersCount={usersCount}
          currentUser={session.user.name}
          roomName={roomName}
        />
        <UsersSection users={users} />
      </RoomContainer>
    </>
  );
};

export async function getServerSideProps(context) {
  const { req } = context;

  const { roomName } = context.query;

  //check if user is authenticated
  const session = await getSession({ req });

  //navigate user back to login page
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return { props: { session, room: roomName } };
}

export default RoomPage;
