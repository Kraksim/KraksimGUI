import { Box } from '@mui/material';
import React from 'react';

import ErrorPage from '../../common/components/ErrorPage';
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
  const { data, isLoading, error } = useGetAllMapsBasicInfoQuery();


  if (error) {
    return <ErrorPage />;
  }

  return (
      <Box display="block" margin="5%">
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {isLoading ? getLoaders(10) : data
            ?.map(basicMap => <MapCard key={basicMap.id} map={basicMap}/>)}
      </Box>
      </Box>
  );
}