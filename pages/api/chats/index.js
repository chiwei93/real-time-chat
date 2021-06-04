import { getSession } from 'next-auth/client';
import { pusher } from '../../../util/pusher';

import dbConnect from '../../../util/dbConnect';
import Room from '../../../models/room';

export default async function handler(req, res) {
  const { method } = req;

  //if its a post method
  if (method === 'POST') {
    const { roomName } = req.body;

    //validation check
    if (roomName.length === 0) {
      return res.status(422).json({ message: 'Must provide a room name' });
    }

    try {
      //connect to database
      await dbConnect();

      //check if user is authenticated
      const session = await getSession({ req });

      if (!session) {
        const error = new Error('User not authenticated');
        error.statusCode = 403;
        throw error;
      }

      //check if the room name existed already
      const room = await Room.findOne({ roomName });

      //if true
      if (room) {
        const error = new Error('The room name already existed');
        error.statusCode = 400;
        throw error;
      }

      //if false, save to database
      const newRoom = await Room.create({
        roomName,
        userId: session.id,
        createdAt: Date.now(),
      });

      //sent the new room info back
      await pusher.trigger('chats-page', 'add-chatRoom', {
        room: newRoom,
      });

      res.status(201).json({ room: newRoom });
    } catch (err) {
      //handle errors
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = 'Internal Server Error';
      }

      res.status(err.statusCode).json({ message: err.message });
    }
  } else {
    //if the route does not exist
    res.status(404).json({ message: 'This route does not exist.' });
  }
}
