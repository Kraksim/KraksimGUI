import { Box, Typography } from '@mui/material';
import React from 'react';
import { RadialChart, makeWidthFlexible } from 'react-vis';

import { DonutStats } from '../../utils';

const FlexibleRadialChart = makeWidthFlexible(RadialChart);
interface Props {
  title: string;
  height: number;
  innerRadius: number;
  data: DonutStats;
  isLoading: boolean;
}

export default function DonutChart({
  title,
  height,
  innerRadius,
  data,
  isLoading,
}: Props): JSX.Element {

  const laneColors = [
    '#6AB2C4',
    '#18A0FB',
  ];


  const parsedData = [
    { angle: isLoading ? 0 : data.firstSimulationAngle, color: laneColors[0] },
    { angle: isLoading ? 0 : data.secondSimulationAngle,  color: laneColors[1] },
  ];

  return (
    <Box>
      <Box sx={{ minHeight: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography sx={{ fontWeight: 'bold' }} variant="h4">{title}</Typography>
      </Box>
      <FlexibleRadialChart
        animation
        data={parsedData}
        colorType="literal"
        height={height}
        radius={height / 2}
        innerRadius={innerRadius}
      />
    </Box>
  );
}
