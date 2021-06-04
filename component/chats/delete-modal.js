import ReactDOM from 'react-dom';
import { FaTimes } from 'react-icons/fa';

import classes from './delete-modal.module.css';

const DeleteModal = ({ onDelete, closeModal }) => {
  return ReactDOM.createPortal(
    <div className={classes.overlay} onClick={closeModal}>
      <div className={classes.modal} onClick={e => e.stopPropagation()}>
        <button className={classes.btnClose} onClick={closeModal}>
          <FaTimes className={classes.icon} />
        </button>

        <h3>Are you sure you want to delete this room?</h3>

        <div className={classes.btnContainer}>
          <button
            className={`${classes.btn} ${classes.marRight}`}
            onClick={onDelete}
          >
            Confirm
          </button>

          <button className={classes.btn} onClick={closeModal}>
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('modal')
  );
};

export default DeleteModal;
