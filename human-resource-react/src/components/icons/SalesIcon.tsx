import { SvgIcon, SvgIconProps } from '@mui/material';

const SalesIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 3C3.89543 3 3 3.89545 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89545 20.1046 3 19 3H5ZM8 13C8 12.4477 7.55228 12 7 12C6.44772 12 6 12.4477 6 13V17C6 17.5523 6.44772 18 7 18C7.55228 18 8 17.5523 8 17V13ZM12 9C12.5523 9 13 9.44769 13 10V17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17V10C11 9.44769 11.4477 9 12 9ZM18 7C18 6.44769 17.5523 6 17 6C16.4477 6 16 6.44769 16 7V17C16 17.5523 16.4477 18 17 18C17.5523 18 18 17.5523 18 17V7Z"
        fill="white"
      />
    </SvgIcon>
  );
};

export default SalesIcon;
