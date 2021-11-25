import { Typography } from '@mui/material';
import React from 'react';

import { useGetStatisticsFromSimulationQuery } from '../simulationApi';

import { LineBarChart } from './components/charts/LineBarChart';
import LineBarChartWithDropdown from './components/charts/LineBarChartWithDropdown';
import { ChartBox, StatisticsContainer } from './components/style';
import { getAllStatsForLineBar } from './utils';

interface Props {
  selectedSimulationId: number;
}

export default function StatisticsPage({
  selectedSimulationId,
}: Props): JSX.Element {
  const { data, isLoading, error } =
    useGetStatisticsFromSimulationQuery(selectedSimulationId);

  const roadNames = data ? data[0].roadNames : {};

  const turn = data?.length ?? 0;

  const {
    currentAverageVelocityByTurn,
    totalAverageVelocityByTurn,
    currentFlowMap,
    totalFlowMap,
    currentDensityMap,
    totalDensityMap,
    currentRoadAvgVelocityMap,
    totalRoadAvgVelocityMap,
  } = getAllStatsForLineBar(data);

  const averageVelocityChart = (
    <LineBarChart
      turn={turn}
      title={'Average Velocity'}
      barWidth={0.8}
      lineSeries={[
        {
          data: totalAverageVelocityByTurn,
          label: 'Total Average Velocity',
        },
      ]}
      barSeries={[
        {
          data: currentAverageVelocityByTurn,
          label: 'Current Average Velocity',
        },
      ]}
      height={500}
      isLoading={isLoading}
      error={error}
    />
  );

  const flowChart = (
    <LineBarChartWithDropdown
      turn={turn}
      title={'Flow by road'}
      roadNames={roadNames}
      height={500}
      barWidth={0.8}
      dropdownValues={[...currentFlowMap.keys()]}
      barSeriesByEntity={[currentFlowMap]}
      lineSeriesByEntity={[totalFlowMap]}
      isLoading={isLoading}
      error={error}
    />
  );

  const densityChart = (
    <LineBarChartWithDropdown
      turn={turn}
      title={'Density by road'}
      roadNames={roadNames}
      height={500}
      barWidth={0.8}
      dropdownValues={[...currentDensityMap.keys()]}
      barSeriesByEntity={[currentDensityMap]}
      lineSeriesByEntity={[totalDensityMap]}
      isLoading={isLoading}
      error={error}
    />
  );

  const roadAvgChart = (
    <LineBarChartWithDropdown
      turn={turn}
      title={'Average velocity by road'}
      roadNames={roadNames}
      height={500}
      barWidth={0.8}
      dropdownValues={[...currentRoadAvgVelocityMap.keys()]}
      barSeriesByEntity={[currentRoadAvgVelocityMap]}
      lineSeriesByEntity={[totalRoadAvgVelocityMap]}
      isLoading={isLoading}
      error={error}
    />
  );

  return (
    <StatisticsContainer>
      <Typography sx={{ margin: '10px' }} variant="h3">
        {`Statistics for simulation ID: ${selectedSimulationId}`}
      </Typography>
      <ChartBox>
        <div style={{ width: '100%' }}>{averageVelocityChart}</div>
      </ChartBox>
      <ChartBox>
        <div style={{ width: '45%' }}>{flowChart}</div>
        <div style={{ width: '45%' }}>{densityChart}</div>
      </ChartBox>
      <ChartBox>
        <div style={{ width: '100%' }}>{roadAvgChart}</div>
      </ChartBox>
    </StatisticsContainer>
  );
}
