import { SvgIcon, SvgIconProps } from '@mui/material';
const Pin = (props: SvgIconProps) => {
  return (
    <SvgIcon width="23" height="9" viewBox="0 0 23 9" fill="none" {...props}>
      <path d="M2 4.5H21" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="11.5" cy="4.5" r="4.5" fill="currentColor" />
    </SvgIcon>
  );
};

export default Pin;
