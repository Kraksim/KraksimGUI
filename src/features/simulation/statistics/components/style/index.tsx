import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const ChartBox = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'stretch',
  margin: '6px',
}));

export const StatisticsContainer = styled(Box)(() => ({
  padding: '32px',
}));

export const Card = styled(Box)(() => ({
  padding: '32px',
  paddingTop: '10px',
  marginTop: '23px',
  background: '#FFFFFF',
  borderRadius: '20px',
  boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.06)',
}));
