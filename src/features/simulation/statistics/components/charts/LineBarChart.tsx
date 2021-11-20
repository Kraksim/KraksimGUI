import { Box, CircularProgress, Slider, Typography } from '@mui/material';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
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
  barSeries: Series[];
  lineSeries: Series[];
  height: number;
  barWidth: number;
  title: string;
  renderSelect?: JSX.Element;
  isLoading: boolean;
  error?: FetchBaseQueryError | SerializedError;
}

export function LineBarChart({
  barSeries,
  height,
  lineSeries,
  barWidth,
  title,
  renderSelect,
  isLoading,
  error,
}: Props): JSX.Element {
  const [range, setRange] = React.useState<number[]>([0, 100]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setRange(newValue as number[]);
  };

  const barDataToPresent = barSeries
    .map((series) =>
      series.data
        .filter(({ turn }) => turn >= range[0] && turn <= range[1])
        .map((entityData) => ({
          x: entityData.turn,
          y: entityData.value,
        })),
    )
    .filter((x) => x.length > 0);

  const lineDataToPresent = lineSeries
    .map((series) =>
      series.data
        .filter(({ turn }) => turn >= range[0] && turn <= range[1])
        .map((entityData) => ({
          x: entityData.turn,
          y: entityData.value,
        })),
    )
    .filter((x) => x.length > 0);

  const labels = [
    ...barSeries.map((x) => ({ title: x.label })),
    ...lineSeries.map((x) => ({ title: x.label })),
  ];

  const chart = (() => {
    if (isLoading) {
      return (
        <>
          <CircularProgress
            sx={{
              position: 'absolute',
              top: '45%',
              left: '45%',
            }}
          />
          <XYPlot
            animation
            height={height}
            xDomain={[0, 10]}
            yDomain={[0, 10]}
            xDistance={100}
            dontCheckIfEmpty
          >
            <XAxis />
            <YAxis tickFormat={() => ''} />
            <HorizontalGridLines />
            <VerticalGridLines />
          </XYPlot>
        </>
      );
    } else if (error) {
      return <div>Something went wrong :(</div>;
    } else {
      return barDataToPresent.length > 0 || lineDataToPresent.length > 0 ? (
        <>
          <XYPlot
            animation
            dontCheckIfEmpty
            xType="ordinal"
            height={height}
            xDistance={100}
          >
            <VerticalGridLines />
            <HorizontalGridLines />
            <XAxis />
            <YAxis />
            {barDataToPresent.map((series) => (
              <VerticalBarSeries data={series} barWidth={barWidth} />
            ))}
            {lineDataToPresent.map((series) => (
              <LineSeries data={series} />
            ))}
            <div style={{ position: 'absolute', left: '70%', top: '0' }}>
              <DiscreteColorLegend items={labels} />
            </div>
          </XYPlot>
        </>
      ) : (
        <>
          <Typography
            sx={{
              position: 'absolute',
              top: '45%',
              left: '45%',
            }}
          >
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
            <XAxis />
            <YAxis tickFormat={() => ''} />
            <HorizontalGridLines />
            <VerticalGridLines />
          </XYPlot>
        </>
      );
    }
  })();

  return (
    <Box position="relative">
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h4">{title}</Typography>
        {renderSelect}
      </Box>
      {chart}
      <Box>
        <Slider
          value={range}
          onChange={handleChange}
          valueLabelDisplay="auto"
        />
      </Box>
    </Box>
  );
}
