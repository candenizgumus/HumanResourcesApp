import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '@mui/material';
import { Slide } from '@mui/material';

const SliderMessage = (props:{message: string, position: boolean, color: boolean, margin: number}) => {
  const [showMessage, setShowMessage] = useState(true);
  const isMobile = useMediaQuery('(max-width: 600px)');

  const styles = {
    messageContainer: {
      position: 'fixed' as 'fixed',
      top: props.position ? `${props.margin}px` : '',
      bottom: props.position ? '' : `${props.margin}px`,
      left: '20px',
      right: '20px',
      borderRadius: 8,
      backgroundColor: props.color ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      color: props.color ? 'white' : 'black',
      textAlign: 'center' as 'center',
      padding: '10px',
      zIndex: 1000,
    },
    messageText: {
      margin: 0,
      paddingBottom: '10px',
    },
  };
  

  useEffect(() => {
    if (isMobile) {
      setShowMessage(true);

      const handleClose = () => setShowMessage(false);

      // Close the message on touch or scroll
      window.addEventListener('touchstart', handleClose);
      window.addEventListener('scroll', handleClose);

      // Cleanup the event listeners when component unmounts
      return () => {
        window.removeEventListener('touchstart', handleClose);
        window.removeEventListener('scroll', handleClose);
      };
    }
  }, [isMobile]);

  return (
    <Slide direction="down" in={showMessage} mountOnEnter unmountOnExit>
      <div style={styles.messageContainer as React.CSSProperties}>
        <p style={styles.messageText}>{props.message}</p>
      </div>
    </Slide>
  );
};



export default SliderMessage;
