import { Box, LinearProgress, Stack, StackOwnProps } from '@mui/material';

const PageLoader = (props: StackOwnProps) => {
  return (
    <Stack justifyContent="center" alignItems="center" height="100vh" {...props}>
      <Box width={1 / 2}>
        <LinearProgress />
      </Box>
    </Stack>
  );
};

export default PageLoader;
