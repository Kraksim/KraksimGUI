import React from 'react';
import { Box, CircularProgress } from '@mui/material';

import MapVisualizer from './MapVisualizer';
import { useGetBasicMapByIdQuery } from './mapApi';

interface Props {
  mapId: number,
  interactable?: boolean,
}

export function MapLoader(): JSX.Element {
  return (<Box height="100%" width="100%" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress size="100px"/>
    </Box>);
}


export default function MapVisualizerWrapper({
  mapId,
  interactable,
}: Props): JSX.Element {


  const {
    data: basicMap,
    isLoading: isBasicMapLoading,
  } = useGetBasicMapByIdQuery(mapId);


  return (<>
        {(isBasicMapLoading || !basicMap) ?
          <MapLoader/> :
            <MapVisualizer map={basicMap} interactable={interactable}/>
        }</>
  );
}
                                      