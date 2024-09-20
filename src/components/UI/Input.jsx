// components/UI/Input.jsx
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';

const CustomInput = ({ label, type = 'text', value, onChange, className = '', ...props }) => {
  return (
    <TextField 
      label={label} 
      type={type} 
      value={value} 
      onChange={onChange} 
      className={`w-full ${className}`} 
      {...props}
    />
  );
};

CustomInput.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default CustomInput;
