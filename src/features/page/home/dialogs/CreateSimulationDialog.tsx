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
  InputLabel, FormControl,
} from '@mui/material';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from '@emotion/styled';

import { useGetAllMapsBasicInfoQuery } from '../../../map/mapApi';

const FormControlBlock = styled(FormControl)(() => ({
  display: 'block',
  marginTop: 30,
}));

const SizedSelect =  styled(Select)(() => ({
  minWidth: 200,
}));

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
          <FormControlBlock>
            <InputLabel id="select-map">
              Map
            </InputLabel>
            <SizedSelect
                labelId="select-map"
                value={mapId  === '' ? null : mapId }
                label="Map"
                onChange={(e) => { if (e.target.value != null) setMapId(e.target.value as string);}}
            >
            {data?.map(({ id, name }) => <MenuItem key={id} value={id}>{name}</MenuItem>)}
            </SizedSelect>
          </FormControlBlock>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClick} disabled={mapId.length === 0}>Confirm</Button>
        </DialogActions>
    </Dialog>
  );
}