import styled from '@emotion/styled';
import {
  Button, Box, TextField, Select, 
} from '@mui/material';

export const ControlButton = styled(Button)(() => ({
  display: 'block',
  margin: '7px',
  maxHeight: '50px',
}));

export const FormInpiutField = styled(TextField)(() => ({
  margin: '5px',
  width: '170px',
}));

export const MovementFormInputField = styled(TextField)(() => ({
  margin: '5px',
  width: '275px',
}));

export const DeleteButton = styled(ControlButton)(() => ({
  marginTop: '30px',
}));

export const FormSelect = styled(Select)(() => ({
  margin: '5px',
  width: '230px',
}));

export const MovementFormSelect = styled(Select)(() => ({
  margin: '5px',
  width: '275px',
}));

export const FormBox = styled(Box)(() => ({
  display: 'block',
}));

export const ControlContainer = styled(Box)(() => ({
  display: 'block',
  maxWidth: '300px',
  margin: '10px',
  width: 'initial',
}));

export const AddedElementListBox = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'left',
  flexDirection: 'column',
  maxWidth: '600px',
  margin: '5px',
}));

export const ElementBox = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'left',
  flexWrap: 'wrap',
  margin: '5px',
}));

export const ScrollbarBox = styled(Box)(() => ({
  maxHeight: '200px',
  overflow: 'scroll',
}));
