import { CircularProgress, Stack, StackOwnProps } from '@mui/material';

const Progress = (props: StackOwnProps) => {
  return (
    <Stack justifyContent="center" alignItems="center" height="100vh" {...props}>
      <CircularProgress />
    </Stack>
  );
};

export default Progress;
