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
}

export function LineBarChart({
  barSeries, height, lineSeries, barWidth, 
}: Props): JSX.Element {
  const barDataToPresent = barSeries
    .map(series => series.data.map(entityData => ({ x: entityData.turn, y: entityData.value })));
  

  const lineDataToPresent = lineSeries
    .map(series => series.data.map(entityData => ({ x: entityData.turn, y: entityData.value })));
  
  
  const labels = [...barSeries.map(x => ({ title: x.label })), ...lineSeries.map(x => ({ title: x.label }))];



  return (
        <XYPlot xType="ordinal" height={height} xDistance={100}>
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
  );
}