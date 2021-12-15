import { Box, Typography } from '@mui/material';
import React from 'react';

import ErrorPage from '../../common/components/ErrorPage';
import { useGetSimulationBasicInfoQuery, useGetStatisticsFromSimulationQuery } from '../simulationApi';
import MapVisualizerWrapper, { MapLoader } from '../../map/MapVisualizerWrapper';

import { LineBarChart } from './components/charts/LineBarChart';
import LineBarChartWithDropdown from './components/charts/LineBarChartWithDropdown';
import { Card, ChartBox, StatisticsContainer } from './components/style';
import { getAllStatsForLineBar } from './utils';

interface Props {
  selectedSimulationId: number;
}

export default function StatisticsPage({
  selectedSimulationId,
}: Props): JSX.Element {
  const { data, isLoading, error } =
    useGetStatisticsFromSimulationQuery(selectedSimulationId);

  const {
    data: simulationsBasicData,
  } = useGetSimulationBasicInfoQuery([selectedSimulationId]);


  const roadNames = data && data.length > 0 ? data[0].roadNames : {};

  const turn = data?.length ?? 0;

  if (error){
    return <ErrorPage/>;
  }

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
      dropdownLabel='Road'
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
      dropdownLabel='Road'
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
      dropdownLabel='Road'
      height={500}
      barWidth={0.8}
      dropdownValues={[...currentRoadAvgVelocityMap.keys()]}
      barSeriesByEntity={[currentRoadAvgVelocityMap]}
      lineSeriesByEntity={[totalRoadAvgVelocityMap]}
      isLoading={isLoading}
      error={error}
    />
  );

  const mapGraphVis = simulationsBasicData && simulationsBasicData.length > 0 ?
        <Box width="100%" height="100%">
            <MapVisualizerWrapper mapId={simulationsBasicData[0].mapId}/>
        </Box> : <MapLoader/>;

  return (
    <StatisticsContainer>
      <Typography sx={{ margin: '10px' }} variant="h3">
        {`Statistics for simulation ID: ${selectedSimulationId}`}
      </Typography>
      <ChartBox>
          <Card width={ '95%' }>{averageVelocityChart}</Card>
      </ChartBox>
      <ChartBox sx={{ gap: '10px' }}>
          <Card height={'635px'} width={'38%'}>
              {mapGraphVis}
          </Card>
          <Card width={ '52%' }>{flowChart}</Card>
      </ChartBox>
      <ChartBox sx={{ gap: '10px' }}>
          <Card width={ '52%' }>{densityChart}</Card>
          <Card width={ '38%' }>{roadAvgChart}</Card>
      </ChartBox>
    </StatisticsContainer>
  );
}
