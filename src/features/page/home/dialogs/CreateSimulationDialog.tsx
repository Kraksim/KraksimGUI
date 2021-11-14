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
} from '@mui/material';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useGetAllMapsBasicInfoQuery } from '../../../map/mapApi';

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
            <Select
                id="select-map"
                value={mapId}
                label="Map"
                onChange={(e) => setMapId(e.target.value)}
            >
            {data?.map(({ id, name }) => <MenuItem key={id} value={id}>{name}</MenuItem>)}
            </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClick} disabled={mapId.length === 0}>Confirm</Button>
        </DialogActions>
    </Dialog>
  );
}