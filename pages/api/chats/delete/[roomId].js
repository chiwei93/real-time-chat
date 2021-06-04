import { getSession } from 'next-auth/client';
import { pusher } from '../../../../util/pusher';

import dbConnect from '../../../../util/dbConnect';
import Room from '../../../../models/room';

export default async function handler(req, res) {
  const { method } = req;

  try {
    //connect to database
    await dbConnect();

    //if its a delete request
    if (method === 'DELETE') {
      //check if user is authenticated
      const session = await getSession({ req });

      //if false
      if (!session) {
        const error = new Error('User not authenticated');
        error.statusCode = 403;
        throw error;
      }

      //get the room id from the query
      const { roomId } = req.query;

      //check if room exist and it belongs to the user
      const room = await Room.findOne({ _id: roomId, userId: session.id });

      //if the room doesn't exist
      if (!room) {
        const error = new Error('User not authorised to delete this room');
        error.statusCode = 403;
        throw error;
      }

      //delete the room
      await Room.findByIdAndDelete(roomId);

      //send the deleted room info back to the client
      await pusher.trigger('chats-page', 'remove-chatRoom', {
        roomId,
      });

      res.status(200).json({ message: 'Room Deleted' });
    }
  } catch (err) {
    //handle error
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = 'Internal server error';
    }

    res.status(err.statusCode).json({ message: err.message });
  }
}
