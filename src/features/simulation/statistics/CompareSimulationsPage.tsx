import { Typography } from '@mui/material';
import React from 'react';

import { useGetStatisticsFromSimulationQuery } from '../simulationApi';
import ErrorPage from '../../common/components/ErrorPage';


import DonutChart from './components/charts/DonutChart';
import { LineBarChart } from './components/charts/LineBarChart';
import LineBarChartWithDropdown from './components/charts/LineBarChartWithDropdown';
import { Card, ChartBox, StatisticsContainer } from './components/style';
import { getAllStatsForDonut, getAllStatsForLineBar } from './utils';

interface Props {
  firstSimulationId: number;
  secondSimulationId: number;
}

export default function CompareSimulationsPage({
  firstSimulationId,
  secondSimulationId,
}: Props): JSX.Element {
  const {
    data: firstSimulationData,
    isLoading: isFirstSimulationLoading,
    error: firstSimulationError,
  } = useGetStatisticsFromSimulationQuery(firstSimulationId);

  const {
    data: secondSimulationData,
    isLoading: isSecondSimulationLoading,
    error: secondSimulationError,
  } = useGetStatisticsFromSimulationQuery(secondSimulationId);

  const isLoading = isFirstSimulationLoading || isSecondSimulationLoading;
  const error = firstSimulationError ?? secondSimulationError;

  
  if (error){
    return <ErrorPage/>;
  }

  const roadNames = firstSimulationData && firstSimulationData.length > 0 ? firstSimulationData[0].roadNames : {};

  const turn = Math.max(
    firstSimulationData?.length ?? 0,
    secondSimulationData?.length ?? 0,
  );

  const firstSimulationParsedStats = getAllStatsForLineBar(firstSimulationData);
  const secondSimulationParsedStats =
    getAllStatsForLineBar(secondSimulationData);

  const donutData = getAllStatsForDonut(
    firstSimulationData ?? [],
    secondSimulationData ?? [],
  );

  const averageVelocityChart = (
    <LineBarChart
      turn={turn}
      title={'Average Velocity'}
      barWidth={0.8}
      lineSeries={[
        {
          data: firstSimulationParsedStats.totalAverageVelocityByTurn,
          label: `Total Average Velocity - Simulation ${firstSimulationId}`,
        },
        {
          data: secondSimulationParsedStats.totalAverageVelocityByTurn,
          label: `Total Average Velocity - Simulation ${secondSimulationId}`,
        },
      ]}
      barSeries={[
        {
          data: firstSimulationParsedStats.currentAverageVelocityByTurn,
          label: `Current Average Velocity - Simulation ${firstSimulationId}`,
        },
        {
          data: secondSimulationParsedStats.currentAverageVelocityByTurn,
          label: `Current Average Velocity - Simulation ${secondSimulationId}`,
        },
      ]}
      height={500}
      isLoading={isLoading}
      error={error}
    />
  );

  const flowChart = (
    <LineBarChartWithDropdown
      title={'Flow by road'}
      turn={turn}
      roadNames={roadNames}
      height={500}
      barWidth={0.8}
      dropdownLabel='Road'
      dropdownValues={[...firstSimulationParsedStats.currentFlowMap.keys()]}
      barSeriesByEntity={[
        firstSimulationParsedStats.currentFlowMap,
        secondSimulationParsedStats.currentFlowMap,
      ]}
      lineSeriesByEntity={[
        firstSimulationParsedStats.totalFlowMap,
        secondSimulationParsedStats.totalFlowMap,
      ]}
      isLoading={isLoading}
      error={error}
    />
  );

  const densityChart = (
    <LineBarChartWithDropdown
      title={'Density by road'}
      roadNames={roadNames}
      turn={turn}
      height={500}
      barWidth={0.8}
      dropdownLabel='Road'
      dropdownValues={[...firstSimulationParsedStats.currentDensityMap.keys()]}
      barSeriesByEntity={[
        firstSimulationParsedStats.currentDensityMap,
        secondSimulationParsedStats.currentDensityMap,
      ]}
      lineSeriesByEntity={[
        firstSimulationParsedStats.totalDensityMap,
        secondSimulationParsedStats.totalDensityMap,
      ]}
      isLoading={isLoading}
      error={error}
    />
  );

  const roadAvgChart = (
    <LineBarChartWithDropdown
      title={'Average velocity by road'}
      roadNames={roadNames}
      turn={turn}
      height={500}
      barWidth={0.8}
      dropdownLabel='Road'
      dropdownValues={[
        ...firstSimulationParsedStats.currentRoadAvgVelocityMap.keys(),
      ]}
      barSeriesByEntity={[
        firstSimulationParsedStats.currentRoadAvgVelocityMap,
        secondSimulationParsedStats.currentRoadAvgVelocityMap,
      ]}
      lineSeriesByEntity={[
        firstSimulationParsedStats.totalRoadAvgVelocityMap,
        secondSimulationParsedStats.totalRoadAvgVelocityMap,
      ]}
      isLoading={isLoading}
      error={error}
    />
  );

  return (
    <StatisticsContainer>
      <Typography sx={{ margin: '10px', fontWeight: 'bold' }} variant="h3">
        {`Statistics comparison for simulation ID: ${firstSimulationId} and ${secondSimulationId}`}
      </Typography>
      <ChartBox sx={{ gap: '10px' }}>
        <Card width={'45%'}>{averageVelocityChart}</Card>
        <Card width={'45%'}>
          <DonutChart
            height={450}
            data={donutData}
            isLoading={isFirstSimulationLoading || isSecondSimulationLoading}
            title="Average Velocity - Donut"
            innerRadius={180}
          />
        </Card>
      </ChartBox>
      <ChartBox sx={{ gap: '10px' }}>
        <Card width={'45%'}>{flowChart}</Card>
        <Card width={'45%'}>{densityChart}</Card>
      </ChartBox>
      <ChartBox>
        <Card width={'100%'}>{roadAvgChart}</Card>
      </ChartBox>
    </StatisticsContainer>
  );
}
