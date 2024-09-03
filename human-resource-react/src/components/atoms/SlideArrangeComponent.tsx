import React from 'react';
import { Box, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface SlideArrangeComponentProps {
  imageUrls: string[];
  onUpdateImages: (updatedImages: string[]) => void;
}

const SlideArrangeComponent: React.FC<SlideArrangeComponentProps> = ({ imageUrls, onUpdateImages }) => {
  const handleDeleteImage = (index: number) => {
    const updatedImages = imageUrls.filter((_, i) => i !== index);
    onUpdateImages(updatedImages);
  };

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(imageUrls);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onUpdateImages(items);
  };

  return (
    <Box>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="images" direction="horizontal">
          {(provided) => (
            <Box
              display="flex"
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{ overflowX: 'auto', padding: 1 }}
            >
              {imageUrls.map((url, index) => (
                <Draggable key={index} draggableId={`image-${index}`} index={index}>
                  {(provided) => (
                    <Box
                      display="flex"
                      alignItems="center"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        marginRight: 2,
                        border: '1px solid #ccc',
                        padding: 1,
                        borderRadius: 1,
                        minWidth: 100,
                        minHeight: 100,
                      }}
                    >
                      <img src={url} alt={`Slide ${index + 1}`} style={{ width: 100, height: 100 }} />
                      <IconButton onClick={() => handleDeleteImage(index)} sx={{ marginLeft: 2 }}>
                        <Delete />
                      </IconButton>
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};

export default SlideArrangeComponent;
