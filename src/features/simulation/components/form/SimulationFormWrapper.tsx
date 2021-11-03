import { InputLabel, MenuItem } from '@mui/material';
import React, { useState } from 'react';

import { useGetAllMapIdsQuery } from '../../../map/mapApi';

import { FormSelect } from './common';
import CreateSimulationForm from './CreateSimulationForm';


export default function SimulationFormWrapper(): JSX.Element{

  const { data } = useGetAllMapIdsQuery();
  const [selectedMapId, setSelectedMapId] = useState('');
  const parsedId = selectedMapId === '' ? null : parseInt(selectedMapId);
  return (
        <div>
            { data && 
              <div>
                <h1>Select Map for a new Simulation</h1>
                <InputLabel htmlFor="mapId">Map ID</InputLabel>
                <FormSelect 
                  name="mapId"
                  value={selectedMapId} 
                  onChange={(e) => setSelectedMapId(e.target.value as string)} 
                  label="Map ID">
                  {data.map(id => <MenuItem value={id}>{id}</MenuItem>)}
                </FormSelect>
              </div>
            }
            {parsedId && <CreateSimulationForm mapId={parsedId}/>}
        </div>
  );
}