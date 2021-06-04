import bcrypt from 'bcryptjs';

import dbConnect from '../../util/dbConnect';
import User from '../../models/user';

export default async function handler(req, res) {
  const { method } = req;

  //connect to database
  await dbConnect();

  //check if it's a post request
  if (method === 'POST') {
    const { username, password } = req.body;

    //validate input
    const validationResults = [];

    //check if the username is empty
    if (username.length === 0) {
      validationResults.push({
        field: 'username',
        message: 'Username cannot be empty',
      });
    }

    //check if the password is at least 8 characters long
    if (password.length < 8) {
      validationResults.push({
        field: 'password',
        message: 'Password should be at least 8 characters long',
      });
    }

    //return validation errors if true
    if (validationResults.length > 0) {
      return res
        .status(422)
        .json({ message: 'Validation Error', errors: validationResults });
    }

    try {
      //find if the username exist
      const user = await User.findOne({ username });

      //return bad request response if true
      if (user) {
        const error = new Error('Username already existed');
        error.statusCode = 400;
        throw error;
      }

      //hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      //a create a new user document in the database
      const newUser = await User.create({
        username,
        password: hashedPassword,
        createdAt: Date.now(),
      });

      newUser.password = undefined;

      res.status(201).json({ user: newUser });
    } catch (err) {
      //check if the err have any statuscode
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = 'Internal server error';
      }

      res.status(err.statusCode).json({ message: err.message });
    }
  } else {
    //if the request is not a post request
    res.status(404).json({ message: "This route doesn't exist" });
  }
}
