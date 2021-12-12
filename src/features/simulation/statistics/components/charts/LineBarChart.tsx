import {
  Box, CircularProgress, Slider, Typography,
} from '@mui/material';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import React, { useEffect } from 'react';
import {
  FlexibleWidthXYPlot as XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries,
  DiscreteColorLegend,
  LineSeries, AreaSeries, GradientDefs,
} from 'react-vis';

import 'react-vis/dist/style.css';
import { maxOrDefault, minOrDefault } from '../../../../common/utils';

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
  turn: number,
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

  const allTurns = lineSeries.flatMap(series=> series.data.map(val=> val.turn));
  const minTurn = minOrDefault(allTurns, 0);
  const maxTurn = maxOrDefault(allTurns, 100);

  const [range, setRange] = React.useState<number[]>([minTurn, maxTurn]);
  useEffect(() => setRange([minTurn, maxTurn]), [minTurn, maxTurn]);
  const handleChange = (event: Event, newValue: number | number[]) => {
    setRange(newValue as number[]);
  };
  const turnsDisplayed = range[1] - range[0];

  function prepareDataOf(seriesArr: Series[]) {
    const result = seriesArr
      .map((series) => {
        return series.data
          .filter(({ turn }) => turn >= range[0] && turn <= range[1])
          .sort((s1, s2) => s1.turn - s2.turn)
          .map((entityData) => ({
            x: entityData.turn,
            y: entityData.value,
          }));
      },
      );

    if (result.every((x) => x.length == 0)) {
      return [];
    }
    return result;
  }

  const barDataToPresent = prepareDataOf(barSeries);
  const lineDataToPresent = prepareDataOf(lineSeries);

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
              left: '49%',
            }}
          />
          <XYPlot
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
            dontCheckIfEmpty
            xType="ordinal"
            height={height}
            xDistance={100}
          >
            <HorizontalGridLines />
              <GradientDefs>
                  <linearGradient id="gradient0" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#6AB2C4" stopOpacity={0.7}/>
                      <stop offset="100%" stopColor="#337180" stopOpacity={0.3} />
                  </linearGradient>
                  <linearGradient id="gradient1" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#18A0FB" stopOpacity={0.7}/>
                      <stop offset="100%" stopColor="#18A0FB" stopOpacity={0.3} />
                  </linearGradient>
              </GradientDefs>
            {turnsDisplayed > 50 ? null : <XAxis />}
            <YAxis/>
            {barDataToPresent.map((series, index) => (
              turnsDisplayed > 80 ?
                  <AreaSeries
                      color={`url(#gradient${index})`}
                      curve={'curveMonotoneX'} data={series}/> :
              <VerticalBarSeries
                  color={`url(#gradient${index})`}
                  data={series} barWidth={barWidth} />
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
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ minHeight: '100px' }}>
        <Typography sx={{ fontWeight: 'bold' }} variant="h4">{title}</Typography>
        {renderSelect}
      </Box>
      {chart}
      <Box>
        <Slider
          value={range}
          onChange={handleChange}
          valueLabelDisplay="auto"
          max={maxTurn}
          min={minTurn}
        />
      </Box>
    </Box>
  );
}
