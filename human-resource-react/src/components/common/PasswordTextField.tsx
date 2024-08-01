import { SyntheticEvent, forwardRef, useState } from 'react';
import { TextField, InputAdornment, IconButton, TextFieldProps } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

const PasswordTextField = forwardRef<HTMLDivElement, TextFieldProps>((props, ref) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handlePasswordVisibility = (event: SyntheticEvent) => {
    event.preventDefault();
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <TextField
      type={isPasswordVisible ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handlePasswordVisibility}>
              {isPasswordVisible ? (
                <IconifyIcon icon="material-symbols-light:visibility-outline-rounded" />
              ) : (
                <IconifyIcon icon="material-symbols-light:visibility-off-outline-rounded" />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
      ref={ref}
      {...props}
    />
  );
});

export default PasswordTextField;
