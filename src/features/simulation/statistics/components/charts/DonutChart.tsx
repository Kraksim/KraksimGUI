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
}

export default function DonutChart({
  title,
  height,
  innerRadius,
  data,
}: Props): JSX.Element {
  const parsedData = [
    { angle: data.firstSimulationAngle },
    { angle: data.secondSimulationAngle },
  ];

  return (
    <Box>
      <Typography variant="h4">{title}</Typography>
      <FlexibleRadialChart
        animation
        data={parsedData}
        height={height}
        radius={height / 2}
        innerRadius={innerRadius}
      />
    </Box>
  );
}
