import toastify from './toastify';

const handleErrors = (err, message) => {
  //for not found and bad request error
  if (err.response.status === (400 || 404 || 401 || 403)) {
    toastify(false, err.response.data.message);
  } else if (err.response.status === 422) {
    //for validation errors
    err.response.data.errors.forEach(error => {
      toastify(false, error.message);
    });
  } else {
    //for internal server error
    toastify(false, message);
  }
};

export default handleErrors;
