import {
  Card, CardMedia, CardContent, Typography, CardActions, Button, Skeleton, Box, Chip,
} from '@mui/material';
import React from 'react';
import { useHistory } from 'react-router-dom';

import { labelMovementStrategy } from '../../common/labels';
import { Either } from '../../common/types';
import MapVisualizer from '../../map/MapVisualizer';
import { BasicMapInfo } from '../../map/types';

type Props = Either<{ map: BasicMapInfo }, { loading: boolean }>;

export default function MapCard({ map, loading } : Props): JSX.Element{

  const history = useHistory();

  const handleAddSimulationClick = () => {
    history.push(`/simulations/create?mapId=${map?.id}`);
  };

  const handleViewSimulationsClick = () => {
    history.push(`/simulations/all?mapId=${map?.id}`);
  };

  return (
    <Card sx={{ width: 320, margin: '10px' }}>
      <CardMedia sx={{ height: '140px' }}>
        {map && <MapVisualizer map={map} />}
        {loading && <Skeleton variant="rectangular" width={345} height={140} />}
      </CardMedia>
      <CardContent sx={{ height: '200px' }}>
        <Typography gutterBottom variant="h5" component="div">
          {map?.name}
          {loading && <Skeleton variant="text" width="60%" />}
        </Typography>
        <Typography gutterBottom variant="h6" component="div">
          {map && `Type: ${map.type}`}
          {loading && <Skeleton variant="text" width="60%"/>}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
          {map && [...map.compatibleWith
            .map((movementStrategy, index) => <Chip
            sx={{ margin: '4px 4px 4px 0px' }}
            size="small"
            key={index}
            label={labelMovementStrategy(movementStrategy)}/>),
              <Chip
                  sx={{ margin: '4px 4px 4px 0px' }}
                  size="small"
                  key={map.id}
                  style={{ backgroundColor:'rgba(135, 193, 207, 0.31)' }}
                  label={`Simulations: ${map.simulationsCount}`}/>,
          ]}
          {loading && <>
          <Skeleton sx={{ margin: '4px 4px 4px 0px' }} variant="rectangular" width="70%"/>
          <Skeleton sx={{ margin: '4px 4px 4px 0px' }} variant="rectangular" width="70%"/>
          <Skeleton sx={{ margin: '4px 4px 4px 0px' }} variant="rectangular" width="70%"/>
          </>}
        </Box>
        {map && <Typography variant="body2" color="text.secondary">
          {map.description}
        </Typography>}
        {loading &&
        <>
        <Skeleton/>
        <Skeleton/>
        <Skeleton/>
        </>
        }
      </CardContent>
      <CardActions>
        {map && <><Button size="small" onClick={handleViewSimulationsClick}>View Simulations</Button>
        <Button size="small" onClick={handleAddSimulationClick}>Create Simulation</Button></>}
      </CardActions>
    </Card>
  );
}