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

import { useGetAllMapsBasicInfoQuery } from '../../../map/mapApi';
import { useGetAllSimulationsQuery } from '../../../simulation/simulationApi';

import LabeledInput from './LabeledInput';

function checkIfButtonIsDisabled(strings: string[]) {
  return !strings.every((x) => x.length > 0);
}

type Props = DialogProps & {
  afterConfirm: () => void,
};

export default function CompareSimulationsDialog({
  open,
  onClose,
  afterConfirm,
}: Props): JSX.Element {
  const { data: mapData, isError: connectionError1 } = useGetAllMapsBasicInfoQuery();
  const { data: simulationData, isError: connectionError2  } = useGetAllSimulationsQuery();
  const [mapId, setMapId] = useState('');
  const [firstSimulationId, setFirstSimulationId] = useState('');
  const [secondSimulationId, setSecondSimulationId] = useState('');
  const history = useHistory();
  const totalError = connectionError1 ?? connectionError2;

  const simulationsNr = simulationData
    ?.filter(
      (simulation) =>
        mapId != null &&
              simulation.mapId === parseInt(mapId))?.length ;
  const isTooFewSimulationsToCompare = mapId.length !== 0 && (simulationsNr === 0 || simulationsNr === 1 );

  const handleClick = () => {
    afterConfirm();
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
        <LabeledInput
            marginTop={30}
            label="Map"
            disabled = { !mapData }
            value={mapId}
            setValue={setMapId}
            error={isTooFewSimulationsToCompare}
            helperText={totalError ? 'Couldn\'t load maps. Check your connection.' :
              'Map has to have at least 2 simulations to compare.'}
        >
          {mapData?.map(({ id, name }) => (
            <MenuItem key={id} value={id.toString()}>
              {name}
            </MenuItem>
          ))}
        </LabeledInput>
        <LabeledInput
          marginTop={10}
          label="First Simulation"
          value={firstSimulationId}
          setValue={setFirstSimulationId}
          disabled={mapId.length === 0 || isTooFewSimulationsToCompare}
          spaceUnder
        >
          {simulationData
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
        </LabeledInput>
        <LabeledInput
          marginTop={10}
          label="Second Simulation"
          value={secondSimulationId}
          setValue={setSecondSimulationId}
          disabled={mapId.length === 0 || isTooFewSimulationsToCompare }
        >
          {simulationData
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
        </LabeledInput>
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
