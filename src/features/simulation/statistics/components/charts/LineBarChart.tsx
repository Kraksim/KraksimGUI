import { Box, Typography } from '@mui/material';
import React from 'react';
import {
  FlexibleWidthXYPlot as XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries,
  DiscreteColorLegend,
  LineSeries,
} from 'react-vis';

import 'react-vis/dist/style.css';
import { Series } from './types';



interface Props {
  barSeries: Series[],
  lineSeries: Series[]
  height: number,
  barWidth: number,
  title: string,
}

export function LineBarChart({
  barSeries, height, lineSeries, barWidth, title,
}: Props): JSX.Element {
  const barDataToPresent = barSeries
    .map(series => series.data.map(entityData => ({ x: entityData.turn, y: entityData.value })));
  

  const lineDataToPresent = lineSeries
    .map(series => series.data.map(entityData => ({ x: entityData.turn, y: entityData.value })));
  
  
  const labels = [...barSeries.map(x => ({ title: x.label })), ...lineSeries.map(x => ({ title: x.label }))];

  const render = barDataToPresent.length > 0 || lineDataToPresent.length > 0 ? (
    <Box>
      <Typography variant="h4">
        {title}
      </Typography>
        <XYPlot animation dontCheckIfEmpty xType="ordinal" height={height} xDistance={100}>
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis />
          {barDataToPresent.map(series => <VerticalBarSeries data={series} barWidth={barWidth} />)}
          {lineDataToPresent.map(series => <LineSeries data={series} />)}
          <div style={{ position: 'absolute', left:'70%', top:'0' }}>
            <DiscreteColorLegend items={labels} />
          </div>
        </XYPlot>
    </Box>
  ) : (
  <Box position="relative">
    <Typography variant="h4">
      {title}
    </Typography>
    <Typography sx={{
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: '45%',
      left: '45%',
    }}>
      No data found :(
    </Typography>
    <XYPlot
      animation
      height={height}
      xDomain={[0, 10]}
      yDomain={[0, 10]}
      xDistance={100}
      dontCheckIfEmpty
    >
      <XAxis/>
      <YAxis tickFormat={() => ''}/>
      <HorizontalGridLines/>
      <VerticalGridLines/>
    </XYPlot>
  </Box>
  );


  return render;
}