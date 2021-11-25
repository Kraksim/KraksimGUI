import { Typography } from '@mui/material';
import React from 'react';

import { useGetStatisticsFromSimulationQuery } from '../simulationApi';

import { LineBarChart } from './components/charts/LineBarChart';
import LineBarChartWithDropdown from './components/charts/LineBarChartWithDropdown';
import { ChartBox, StatisticsContainer } from './components/style';
import { getAllStatsFromData, renderLoadingErrorOrComponent } from './utils';

interface Props {
  firstSimulationId: number,
  secondSimulationId: number,
}

export default function CompareSimulationPage({ firstSimulationId, secondSimulationId }: Props): JSX.Element{

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

  const roadNames = firstSimulationData ? firstSimulationData[0].roadNames : {};

  const firstSimulationParsedStats = getAllStatsFromData(firstSimulationData);
  const secondSimulationParsedStats = getAllStatsFromData(secondSimulationData);

  const averageVelocityChart = renderLoadingErrorOrComponent(
        <LineBarChart
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
        />,
        isFirstSimulationLoading && isSecondSimulationLoading,
        firstSimulationError ?? secondSimulationError,
  );

  const flowChart = renderLoadingErrorOrComponent(
        <LineBarChartWithDropdown
            title={'Flow by road'}
            roadNames={roadNames}
            height={500}
            barWidth={0.8}
            dropdownValues={[...firstSimulationParsedStats.currentFlowMap.keys()]}
            barSeriesByEntity={[firstSimulationParsedStats.currentFlowMap, secondSimulationParsedStats.currentFlowMap]}
            lineSeriesByEntity={[firstSimulationParsedStats.totalFlowMap, secondSimulationParsedStats.totalFlowMap]}
        />,
        isFirstSimulationLoading && isSecondSimulationLoading,
        firstSimulationError ?? secondSimulationError,
  );

  const densityChart = renderLoadingErrorOrComponent(
        <LineBarChartWithDropdown
            title={'Density by road'}
            roadNames={roadNames}
            height={500}
            barWidth={0.8}
            dropdownValues={[...firstSimulationParsedStats.currentDensityMap.keys()]}
            barSeriesByEntity={[firstSimulationParsedStats.currentDensityMap,
              secondSimulationParsedStats.currentDensityMap]}
            lineSeriesByEntity={[firstSimulationParsedStats.totalDensityMap,
              secondSimulationParsedStats.totalDensityMap]}
        />,
        isFirstSimulationLoading && isSecondSimulationLoading,
        firstSimulationError ?? secondSimulationError,
  );

  const roadAvgChart = renderLoadingErrorOrComponent(
        <LineBarChartWithDropdown
            title={'Average velocity by road'}
            roadNames={roadNames}
            height={500}
            barWidth={0.8}
            dropdownValues={[...firstSimulationParsedStats.currentRoadAvgVelocityMap.keys()]}
            barSeriesByEntity={[firstSimulationParsedStats.currentRoadAvgVelocityMap,
              secondSimulationParsedStats.currentRoadAvgVelocityMap]}
            lineSeriesByEntity={[firstSimulationParsedStats.totalRoadAvgVelocityMap,
              secondSimulationParsedStats.totalRoadAvgVelocityMap]}
        />,
        isFirstSimulationLoading && isSecondSimulationLoading,
        firstSimulationError ?? secondSimulationError,
  );

  return (
        <StatisticsContainer>
            <Typography sx={{ margin: '10px' }} variant="h3">
                {`Statistics comparison for simulation ID: ${firstSimulationId} and ${secondSimulationId}`}
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