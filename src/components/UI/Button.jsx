// components/UI/Button.jsx
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';

const CustomButton = ({ text, onClick, variant = 'contained', color = 'primary', className = '', ...props }) => {
  return (
    <Button 
      onClick={onClick} 
      variant={variant} 
      color={color} 
      className={`py-2 px-4 rounded ${className}`} 
      {...props}
    >
      {text}
    </Button>
  );
};

CustomButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['contained', 'outlined', 'text']),
  color: PropTypes.oneOf(['primary', 'secondary', 'inherit', 'default']),
  className: PropTypes.string,
};

export default CustomButton;
