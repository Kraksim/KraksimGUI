import {
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button, 
  DialogProps, 
  Select, 
  MenuItem,
  InputLabel, 
} from '@mui/material';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useGetAllMapsBasicInfoQuery } from '../../../map/mapApi';
import { useGetAllSimulationsQuery } from '../../../simulation/simulationApi';

function checkIfButtonIsDisabled(strings: string[]){
  return !strings.every(x => x.length > 0);
}

export default function CompareSimulationsDialog({ open, onClose }: DialogProps): JSX.Element{

  const { data: mapData } = useGetAllMapsBasicInfoQuery();
  const { data: simiulationData } = useGetAllSimulationsQuery();
  const [mapId, setMapId] = useState(''); 
  const [firstSimulationId, setFirstSimulationId] = useState('');
  const [secondSimulationId, setSecondSimulationId] = useState('');
  const history = useHistory();

  const handleClick = () => {
    history
      .push(`/simulations/compare?firstSimulationId=${firstSimulationId}&secondSimulationId=${secondSimulationId}`);
  };

  return (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>Select Map</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To compare simulations, select a map and then 2 simulations which you want to compare
          </DialogContentText>
            <InputLabel htmlFor="select-map">
              Map
            </InputLabel>
            <Select
                value={mapId}
                label="Map"
                name="select-map"
                onChange={(e) => setMapId(e.target.value)}
            >
            {mapData?.map(({ id, name }) => <MenuItem key={id} value={id.toString()}>{name}</MenuItem>)}
            </Select>
            <InputLabel htmlFor="first-simulation">
              First Simualation
            </InputLabel>
            <Select
                value={firstSimulationId}
                name="first-simulation"
                label="First Simulation"
                disabled={mapId.length === 0}
                onChange={(e) => setFirstSimulationId(e.target.value)}
            >
            {simiulationData
              ?.filter((simulation) => simulation.mapId === parseInt(mapId))
              .map(({ id, name }) => <MenuItem key={id} value={id.toString()}>{name}</MenuItem>)}
            </Select>
            <InputLabel htmlFor="second-simulation">
              First Simualation
            </InputLabel>
            <Select
                name="second-simulation"
                value={secondSimulationId}
                label="Second Simulation"
                disabled={mapId.length === 0}
                onChange={(e) => setSecondSimulationId(e.target.value)}
            >
            {simiulationData
              ?.filter((simulation) => simulation.mapId === parseInt(mapId))
              .map(({ id, name }) => <MenuItem key={id} value={id.toString()}>{name}</MenuItem>)}
            </Select>
        </DialogContent>
        <DialogActions>
          <Button 
          onClick={handleClick} 
          disabled={checkIfButtonIsDisabled([mapId, firstSimulationId, secondSimulationId])}
          >
              Confirm
        </Button>
        </DialogActions>
    </Dialog>
  );
}