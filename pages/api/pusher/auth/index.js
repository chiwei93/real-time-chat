import { getSession } from 'next-auth/client';

import { pusher } from '../../../../util/pusher';

export default async function handler(req, res) {
  const { socket_id, channel_name } = req.body;

  //if it's a post request
  if (req.method === 'POST') {
    try {
      //check if user is authenticated
      const session = await getSession({ req });

      //if false
      if (!session) {
        const error = new Error('User not authenticated');
        error.statusCode = 403;
        throw error;
      }

      //set up presence data
      const presenceData = {
        user_id: session.id,
        user_info: {
          username: session.user.name,
        },
      };

      //authenticate user for presence channel
      const auth = pusher.authenticate(socket_id, channel_name, presenceData);

      res.send(auth);
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
