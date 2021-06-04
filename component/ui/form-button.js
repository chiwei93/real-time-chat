import classes from './form-button.module.css';

const FormButton = ({ text }) => {
  return <button className={classes.btn}>{text}</button>;
};

export default FormButton;
