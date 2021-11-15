import { Typography } from '@mui/material';
import React from 'react';

import { useGetStatisticsFromSimulationQuery } from '../simulationApi';

import { LineBarChart } from './components/charts/LineBarChart';
import LineBarChartWithDropdown from './components/charts/LineBarChartWithDropdown';
import { ChartBox, StatisticsContainer } from './components/style';
import { getAllStatsFromData, renderLoadingErrorOrComponent } from './utils';

interface Props {
  selectedSimulationId: number
}

export default function StatisticsPage({ selectedSimulationId }: Props): JSX.Element{

  const { data, isLoading, error } = useGetStatisticsFromSimulationQuery(selectedSimulationId);

  const roadNames = data ? data[0].roadNames : {};

  const {
    currentAverageVelocityByTurn,
    totalAverageVelocityByTurn,
    currentFlowMap,
    totalFlowMap,
    currentDensityMap,
    totalDensityMap,
    currentRoadAvgVelocityMap,
    totalRoadAvgVelocityMap, 
  } = getAllStatsFromData(data);

  const averageVelocityChart = renderLoadingErrorOrComponent(
    <LineBarChart
    title={'Average Velocity'}
    barWidth={0.8} 
    lineSeries={[{
      data: totalAverageVelocityByTurn,
      label: 'Total Average Velocity',
    }]} 
    barSeries={[{
      data: currentAverageVelocityByTurn,
      label: 'Current Average Velocity',
    }]} 
    height={500} 
    />,
    isLoading,
    error,
  );

  const flowChart = renderLoadingErrorOrComponent(
    <LineBarChartWithDropdown
    title={'Flow by road'}
    roadNames={roadNames}
    height={500} 
    barWidth={0.8}
    dropdownValues={[...currentFlowMap.keys()]}
    barSeriesByEntity={[currentFlowMap]}
    lineSeriesByEntity={[totalFlowMap]}
    />,
    isLoading,
    error,
  );

  const densityChart = renderLoadingErrorOrComponent(
    <LineBarChartWithDropdown
    title={'Density by road'}
    roadNames={roadNames}
    height={500} 
    barWidth={0.8}
    dropdownValues={[...currentDensityMap.keys()]}
    barSeriesByEntity={[currentDensityMap]}
    lineSeriesByEntity={[totalDensityMap]}
    />,
    isLoading,
    error,
  );

  const roadAvgChart = renderLoadingErrorOrComponent(
    <LineBarChartWithDropdown
    title={'Average velocity by road'}
    roadNames={roadNames}
    height={500} 
    barWidth={0.8}
    dropdownValues={[...currentRoadAvgVelocityMap.keys()]}
    barSeriesByEntity={[currentRoadAvgVelocityMap]}
    lineSeriesByEntity={[totalRoadAvgVelocityMap]}
    />,
    isLoading,
    error,
  );

  return (
        <StatisticsContainer>
          <Typography sx={{ margin: '10px' }} variant="h3">
            {`Statistics for simulation ID: ${selectedSimulationId}`}
          </Typography>
          <ChartBox>
            <div style={{ width: '100%' }}>
                {averageVelocityChart}
            </div>  
          </ChartBox>
          <ChartBox>
            <div style={{ width: '50%' }}>
              {flowChart}
            </div>
            <div style={{ width: '50%' }}>
              {densityChart}
            </div>
          </ChartBox>
          <ChartBox>
            <div style={{ width: '100%' }}>
              {roadAvgChart}
            </div>
          </ChartBox>
        </StatisticsContainer>
  );
}