import { getSession } from 'next-auth/client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Pusher from 'pusher-js';
import Head from 'next/head';

import dbConnect from '../../util/dbConnect';
import Room from '../../models/room';
import AddRoomForm from '../../component/chats/add-room-form';
import ChatsList from '../../component/chats/chats-list';
import ContentContainer from '../../component/layout/content-container';
import handleErrors from '../../util/handleErrors';
import toastify from '../../util/toastify';
import DeleteModal from '../../component/chats/delete-modal';

const ChatsPage = ({ fetchedRooms, session }) => {
  //set initial state
  const [rooms, setRooms] = useState(fetchedRooms);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalId, setModalId] = useState('');

  // initialize pusher
  const pusher = new Pusher(process.env.NEXT_PUBLIC_key, {
    cluster: 'ap1',
  });

  useEffect(() => {
    //subscribe to the public channel
    const channel = pusher.subscribe('chats-page');

    //for the add chat room event
    channel.bind('add-chatRoom', data => {
      //update the rooms state
      setRooms(prevState => {
        return [data.room, ...prevState];
      });

      //toast user
      toastify(true, 'Room added successfully!');
    });

    //for the remove chat room event
    channel.bind('remove-chatRoom', data => {
      //find the room in the rooms array
      const { roomId } = data;

      const newArr = [...rooms];

      const roomIndex = rooms.findIndex(room => room._id === roomId);

      //room it from the array
      newArr.splice(roomIndex, 1);

      //update rooms array
      setRooms(newArr);

      //toast user
      toastify(true, 'Room deleted successfully!');

      //close the modal
      setShowModal(false);
    });

    //unsubscibe the channel when user leave this page
    return () => pusher.unsubscribe('chats-page');
  }, []);

  //handling add room
  const addRoom = async roomName => {
    try {
      //start loading
      setIsLoading(true);

      //make post request to api
      const res = await axios.post('/api/chats', { roomName });

      //stop loading
      setIsLoading(false);
    } catch (err) {
      //stop loading
      setIsLoading(false);

      //handle errors
      handleErrors(err, 'Failed to add room! Please try again!');
    }
  };

  //for delete button
  const onDeleteButtonClick = roomId => {
    //show modal
    setShowModal(true);

    //set the room id
    setModalId(roomId);
  };

  //for closing modal
  const closeModal = () => {
    setShowModal(false);
  };

  //for deleting rooms in the chats page
  const deleteRoom = () => {
    //make delete request to api
    axios
      .delete(`/api/chats/delete/${modalId}`)
      .then(res => {})
      .catch(err => {
        //hanlde errors
        handleErrors(err, 'Failed to delete room! Please try again!');
      });
  };

  return (
    <>
      <Head>
        <title>Chats | talki</title>
        <meta
          name="description"
          content="talki is a real time chat application. Login in or sign up now to chat with people around the world."
        />
      </Head>
      <ContentContainer>
        <AddRoomForm addRoom={addRoom} isLoading={isLoading} />
        <ChatsList
          rooms={rooms}
          session={session}
          openModal={onDeleteButtonClick}
        />
        {showModal && (
          <DeleteModal closeModal={closeModal} onDelete={deleteRoom} />
        )}
      </ContentContainer>
    </>
  );
};

export async function getServerSideProps(context) {
  const { req } = context;

  //get session
  const session = await getSession({ req });

  //redirect user back to the login page if they are not authenticated
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  //if authenticate,
  //connect to database
  await dbConnect();

  //find all the created rooms
  let rooms = await Room.find().sort({ createdAt: -1 });

  rooms = JSON.parse(JSON.stringify(rooms));

  return {
    props: { session, fetchedRooms: rooms },
  };
}

export default ChatsPage;
