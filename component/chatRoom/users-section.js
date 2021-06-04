import { useEffect } from 'react';

import classes from './users-section.module.css';

const UsersSection = ({ users }) => {
  useEffect(() => {
    let mounted = true;

    //if mounted, execute the code below
    if (mounted) {
      //scroll to the bottom of the user list
      document
        .getElementById('users_list_bottom')
        .scrollIntoView({ behavior: 'smooth' });
    }
  }, [users]);

  return (
    <div className={classes.container}>
      <h3>Room users:</h3>

      <div className={classes.usersContainer}>
        <ul>
          {users.map(user => {
            return (
              <li className={classes.item} key={user.id}>
                {user.info.username}
              </li>
            );
          })}
          <div id="users_list_bottom"></div>
        </ul>
      </div>
    </div>
  );
};

export default UsersSection;
