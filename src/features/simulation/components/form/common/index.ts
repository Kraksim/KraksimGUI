import styled from '@emotion/styled';
import {
  Button, Box, Container, TextField, Select, 
} from '@mui/material';

export const ControlButton = styled(Button)(() => ({
  display: 'block',
  margin: '5px',
}));

export const FormInpiutField = styled(TextField)(() => ({
  margin: '5px',
}));

export const FormSelect = styled(Select)(() => ({
  margin: '5px',
}));

export const FormBox = styled(Box)(() => ({
  display: 'flex',
}));

export const ControlContainer = styled(Container)(() => ({
  display: 'block',
  maxWidth: '300px',
  margin: '5px',
  width: 'initial',
}));

export const AddedElementListBox = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'left',
  flexDirection: 'column',
  maxWidth: '600px',
}));

export const ElementBox = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'left',
  margin: '5px',
}));

export const ScrollbarBox = styled(Box)(() => ({
  maxHeight: '200px',
  overflow: 'scroll',
}));
