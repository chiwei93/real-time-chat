import { useState } from 'react';

import FormButton from '../ui/form-button';
import classes from './add-room-form.module.css';

const AddRoomForm = ({ addRoom, isLoading }) => {
  //set initial state
  const [roomName, setRoomName] = useState('');
  const [roomNameError, setRoomNameError] = useState(false);

  //for handling form submission
  const onFormSubmit = e => {
    //prevent loading
    e.preventDefault();

    //validation check
    if (roomName.length === 0) {
      return setRoomNameError(true);
    }

    //make api request
    addRoom(roomName);

    //empty the input
    setRoomName('');
  };

  return (
    <form
      className={`${classes.form} ${roomNameError ? classes.error : null}`}
      onSubmit={onFormSubmit}
    >
      <input
        type="text"
        placeholder="Enter room name"
        value={roomName}
        onChange={e => {
          setRoomName(e.target.value);

          if (roomNameError) {
            if (e.target.value.length > 0) {
              setRoomNameError(false);
            }
          }
        }}
      />
      {roomNameError && (
        <p className={classes.errorMsg}>Must provide a room name</p>
      )}
      <FormButton text={isLoading ? 'Adding room...' : 'Add room'} />
    </form>
  );
};

export default AddRoomForm;
