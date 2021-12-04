import { Box } from '@mui/material';
import React from 'react';

import { useGetAllMapsBasicInfoQuery } from '../../map/mapApi';

import MapCard from './MapCard';

function getLoaders(length: number): JSX.Element[]{
  const ret = [];
  for (let i = 0; i < length; i++){
    ret.push(<MapCard key={i} loading/>);
  }
  return ret;
}

export default function MapList(): JSX.Element {
  const { data } = useGetAllMapsBasicInfoQuery();

  return (
      <Box display="block" margin="5%">
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {data ? data
            .map(basicMap => <MapCard key={basicMap.id} map={basicMap}/>) : getLoaders(10)}
      </Box>
      </Box>
  );
}