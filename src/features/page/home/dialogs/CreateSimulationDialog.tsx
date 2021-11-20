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

import LabeledInput from './LabeledInput';

export default function CreateSimulationDialog({ open, onClose }: DialogProps): JSX.Element{

  const { data } = useGetAllMapsBasicInfoQuery();
  const [mapId, setMapId] = useState(''); 
  const history = useHistory();

  const handleClick = () => {
    history.push(`/simulations/create?mapId=${mapId}`);
  };

  return (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>Select Map</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create a simulation, select a map for it
          </DialogContentText>
          <LabeledInput label='Map' value={mapId} setValue={setMapId} >
            {data?.map(({ id, name }) => <MenuItem key={id} value={id}>{name}</MenuItem>)}
          </LabeledInput>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClick} disabled={mapId.length === 0}>Confirm</Button>
        </DialogActions>
    </Dialog>
  );
}