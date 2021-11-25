import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  DialogProps,
  MenuItem,
} from '@mui/material';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from '@emotion/styled';

import { useGetAllMapsBasicInfoQuery } from '../../../map/mapApi';
import { useGetAllSimulationsQuery } from '../../../simulation/simulationApi';

import LabeledInput from './LabeledInput';

function checkIfButtonIsDisabled(strings: string[]) {
  return !strings.every((x) => x.length > 0);
}

const SpacedInput = styled(LabeledInput)(() => ({
  paddingTop: 30,
}));
export default function CompareSimulationsDialog({
  open,
  onClose,
}: DialogProps): JSX.Element {
  const { data: mapData } = useGetAllMapsBasicInfoQuery();
  const { data: simiulationData } = useGetAllSimulationsQuery();
  const [mapId, setMapId] = useState('');
  const [firstSimulationId, setFirstSimulationId] = useState('');
  const [secondSimulationId, setSecondSimulationId] = useState('');
  const history = useHistory();

  const handleClick = () => {
    history.push(
      `/simulations/compare?firstSimulationId=${firstSimulationId}&secondSimulationId=${secondSimulationId}`,
    );
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select Map</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To compare simulations, select a map and then 2 simulations which you
          want to compare
        </DialogContentText>
        <SpacedInput marginTop={30} label="Map" value={mapId} setValue={setMapId}>
          {mapData?.map(({ id, name }) => (
            <MenuItem key={id} value={id.toString()}>
              {name}
            </MenuItem>
          ))}
        </SpacedInput>
        <SpacedInput
          marginTop={30}
          label="First Simulation"
          value={firstSimulationId}
          setValue={setFirstSimulationId}
          disabled={mapId.length === 0}
        >
          {simiulationData
            ?.filter(
              (simulation) =>
                mapId != null &&
                simulation.mapId === parseInt(mapId) &&
                simulation.id !== parseInt(secondSimulationId),
            )
            .map(({ id, name }) => (
              <MenuItem key={id} value={id.toString()}>
                {name}
              </MenuItem>
            ))}
        </SpacedInput>
        <SpacedInput
          marginTop={30}
          label="Second Simulation"
          value={secondSimulationId}
          setValue={setSecondSimulationId}
          disabled={mapId.length === 0}
        >
          {simiulationData
            ?.filter(
              (simulation) =>
                mapId != null &&
                simulation.mapId === parseInt(mapId) &&
                simulation.id !== parseInt(firstSimulationId),
            )
            .map(({ id, name }) => (
              <MenuItem key={id} value={id.toString()}>
                {name}
              </MenuItem>
            ))}
        </SpacedInput>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClick}
          disabled={checkIfButtonIsDisabled([
            mapId,
            firstSimulationId,
            secondSimulationId,
          ])}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
