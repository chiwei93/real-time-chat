import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

import bcrypt from 'bcryptjs';
import dbConnect from '../../../util/dbConnect';
import User from '../../../models/user';

export default NextAuth({
  session: {
    jwt: true,
  },
  jwt: {
    signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
  },
  secret: process.env.JWT_SECRET,
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        //connect to database
        await dbConnect();

        //get username and password entered
        const { username, password } = credentials;

        //validation check
        const errors = [];

        //if username is empty
        if (username.length === 0) {
          errors.push('username');
        }

        //if password is not at least 8 characters long
        if (password.length < 8) {
          errors.push('password');
        }

        if (errors.length > 0) {
          throw new Error('Validation error');
        }

        //find user with that email
        const user = await User.findOne({ username });

        //if can't find user, throw error
        if (!user) {
          throw new Error('Invalid username or password!');
        }

        //check password
        const doMatch = await bcrypt.compare(password, user.password);

        //if don't match
        if (!doMatch) {
          throw new Error('Invalid username or password!');
        }

        //return an object which will be encoded into the jsonwebtoken
        return { id: user._id, name: user.username };
      },
    }),
  ],
  callbacks: {
    //for setting more information on the session sent to the client
    async session(session, user) {
      //setting id on session
      session.id = user.sub;

      return session;
    },
  },
});
