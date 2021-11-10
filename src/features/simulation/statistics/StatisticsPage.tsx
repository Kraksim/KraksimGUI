import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import React from 'react';

import { useGetStatisticsFromSimulationQuery } from '../simulationApi';

import { LineBarChart } from './components/charts/LineBarChart';
import LineBarChartWithDropdown from './components/charts/LineBarChartWithDropdown';
import { Series } from './components/charts/types';

interface Props {
  selectedSimulationId: number
}

function renderLoadingErrorOrComponent(
  component: JSX.Element, isLoading: boolean, error: FetchBaseQueryError | SerializedError | undefined,
){
  if (error){
    return <div>There was an error. Refresh the page or try again later</div>; 
  }
  if (isLoading){
    return <div>Loading...</div>;
  }
  return component;
}

function mapsToSeriesMap(maps: Array<{ turn: number, data: Map<number, number> }>, label: string): Map<number, Series>{
  const ret = new Map<number, Series>();
  const helperMap = new Map<number, Array<{ turn: number, value: number }>>();

  maps.forEach(map => {
    [...map.data.entries()].forEach(([entityId, value]) => {
      if (helperMap.has(entityId)){
        helperMap.get(entityId)?.push({ turn: map.turn, value });
      } else {
        helperMap.set(entityId, [{ turn: map.turn, value }]);
      }
    });
  });

  [...helperMap.entries()].forEach(([entityId, data]) => {
    ret.set(entityId, {
      label: label + 'for entityId: ' + entityId,
      data: data.map((x) => ({ ...x, entityId })),
    });
  });

  return ret;
}

export default function StatisticsPage({ selectedSimulationId }: Props): JSX.Element{

  const { data, isLoading, error } = useGetStatisticsFromSimulationQuery(selectedSimulationId);

  const currentAverageVelocityByTurn = (data ?? []).map(({ turn, simulationId, currentStatisticsValues }) => 
    ({ turn, entityId: simulationId, value: currentStatisticsValues.speedStatistics.wholeMapAverageSpeed }));
  
  const totalAverageVelocityByTurn = (data ?? []).map(({ turn, simulationId, totalStatisticsValues }) => 
    ({ turn, entityId: simulationId, value: totalStatisticsValues.speedStatistics.wholeMapAverageSpeed }));

  const currentFlowMap = mapsToSeriesMap((data ?? []).map(
    ({ turn, currentStatisticsValues }) => ({ turn, data: currentStatisticsValues.roadFlowRatio }),
  ), 'Current Flow');

  const totalFlowMap = mapsToSeriesMap((data ?? []).map(
    ({ turn, totalStatisticsValues }) => ({ turn, data: totalStatisticsValues.roadFlowRatio }),
  ), 'Total Flow');

  const currentDensityMap = mapsToSeriesMap((data ?? []).map(
    ({ turn, currentStatisticsValues }) => ({ turn, data: currentStatisticsValues.density }),
  ), 'Current Density');

  const totalDensityMap = mapsToSeriesMap((data ?? []).map(
    ({ turn, totalStatisticsValues }) => ({ turn, data: totalStatisticsValues.density }),
  ), 'Total Density');

  const currentRoadAvgVelocityMap = mapsToSeriesMap((data ?? []).map(
    ({ turn, currentStatisticsValues }) => ({ turn, data: currentStatisticsValues.speedStatistics.roadAverageSpeed }),
  ), 'Current Average Velocity');

  const totalRoadAvgVelocityMap = mapsToSeriesMap((data ?? []).map(
    ({ turn, totalStatisticsValues }) => ({ turn, data: totalStatisticsValues.speedStatistics.roadAverageSpeed }),
  ), 'Total Average Velocity');

  const averageVelocityChart = renderLoadingErrorOrComponent(
    <LineBarChart 
    barWidth={0.8} 
    lineSeries={[{
      data: currentAverageVelocityByTurn,
      label: 'Current Average Velocity',
    }]} 
    barSeries={[{
      data: totalAverageVelocityByTurn,
      label: 'Total Average Velocity',
    }]} 
    height={500} 
    />,
    isLoading,
    error,
  );

  const flowChart = renderLoadingErrorOrComponent(
    <LineBarChartWithDropdown
    height={500} 
    barWidth={0.8}
    dropdownValues={[...currentFlowMap.keys()]}
    barSeriesByEntity={currentFlowMap}
    lineSeriesByEntity={totalFlowMap}
    />,
    isLoading,
    error,
  );

  const densityChart = renderLoadingErrorOrComponent(
    <LineBarChartWithDropdown
    height={500} 
    barWidth={0.8}
    dropdownValues={[...currentDensityMap.keys()]}
    barSeriesByEntity={currentDensityMap}
    lineSeriesByEntity={totalDensityMap}
    />,
    isLoading,
    error,
  );

  const roadAvgChart = renderLoadingErrorOrComponent(
    <LineBarChartWithDropdown
    height={500} 
    barWidth={0.8}
    dropdownValues={[...currentRoadAvgVelocityMap.keys()]}
    barSeriesByEntity={currentRoadAvgVelocityMap}
    lineSeriesByEntity={totalRoadAvgVelocityMap}
    />,
    isLoading,
    error,
  );

  return (
        <div>
            <div style={{ width: '50%' }}>
                {averageVelocityChart}
            </div>
            <div>
              {flowChart}
            </div>
            <div>
              {densityChart}
            </div>
            <div>
              {roadAvgChart}
            </div>
        </div>
  );
}