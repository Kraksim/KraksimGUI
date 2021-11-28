import { Button, Typography, Box, styled } from '@mui/material';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import CompareSimulationDialog from './dialogs/CompareSimulationsDialog';

const MainContainer = styled(Box)(() => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  textAlign: 'center',
}));

const SectionBox = styled(Box)(() => ({
  margin: '10px',
}));

const ActionButton = styled(Button)(() => ({
  padding: '10px',
  margin: '10px',
}));

export default function HomePage(): JSX.Element {
  const [compareSimulationsDialogOpened, setCompareSimulationsDialogOpened] =
    useState(false);
  const history = useHistory();

  const onViewSimulationsClicked = () => {
    history.push('/simulations/all');
  };

  const onViewMapsClicked = () => {
    history.push('/maps/all');
  };

  return (
    <MainContainer>
      <SectionBox>
        <Typography variant="h1">Kraksim v2</Typography>
        <Typography variant="h4">Traffic Simulator</Typography>
      </SectionBox>
      <SectionBox>
        <ActionButton
          variant="contained"
          onClick={onViewMapsClicked}
        >
          View maps list
        </ActionButton>
        <ActionButton variant="contained" onClick={onViewSimulationsClicked}>
          View simulations list
        </ActionButton>
        <ActionButton
          variant="contained"
          onClick={() => setCompareSimulationsDialogOpened(true)}
        >
          Compare simulations
        </ActionButton>
        <CompareSimulationDialog
          open={compareSimulationsDialogOpened}
          onClose={() => setCompareSimulationsDialogOpened(false)}
        />
      </SectionBox>
    </MainContainer>
  );
}
