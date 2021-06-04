import { pusher } from '../../../util/pusher';

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'POST') {
    const { roomName } = req.query;

    const { username, message } = req.body;

    try {
      //send messages to the channel
      await pusher.trigger(`presence-${roomName}`, 'update-messages', {
        message,
        username,
      });

      res.status(200).json({ username, message });
    } catch (err) {
      //handle errors
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = 'Internal Server Error';
      }

      res.status(err.statusCode).json({ message: err.message });
    }
  } else {
    res.status(404).json({ message: 'Route not found!' });
  }
}
