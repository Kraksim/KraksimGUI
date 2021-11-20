import { Series, StatisticsForEntity } from './components/charts/types';
import { IdToValue, StateStatistics } from './types';

interface LineBarAllStats {
  currentAverageVelocityByTurn: Array<StatisticsForEntity<number>>;
  totalAverageVelocityByTurn: Array<StatisticsForEntity<number>>;
  currentFlowMap: Map<number, Series>;
  totalFlowMap: Map<number, Series>;
  currentDensityMap: Map<number, Series>;
  totalDensityMap: Map<number, Series>;
  currentRoadAvgVelocityMap: Map<number, Series>;
  totalRoadAvgVelocityMap: Map<number, Series>;
}

export interface DonutStats {
  firstSimulationAngle: number;
  secondSimulationAngle: number;
}

function getAngles(
  firstData: number[],
  secondData: number[],
): [number, number] {
  const range = Math.max(firstData.length, secondData.length);
  let firstRet = 0;
  let secondRet = 0;
  for (let i = 0; i < range; i++) {
    const firstValue = firstData[i] ?? 0;
    const secondaValue = secondData[i] ?? 0;
    if (firstValue > secondaValue) {
      firstRet++;
    } else secondRet++;
  }

  return [firstRet, secondRet];
}

export function getAllStatsForDonut(
  firstSimulationData: StateStatistics[],
  secondSimulationData: StateStatistics[],
): DonutStats {
  const [firstAvgVelocityAngle, secondAvgVelocityAngle] = getAngles(
    firstSimulationData?.map(
      ({ currentStatisticsValues }) =>
        currentStatisticsValues.speedStatistics.wholeMapAverageSpeed,
    ),
    secondSimulationData?.map(
      ({ currentStatisticsValues }) =>
        currentStatisticsValues.speedStatistics.wholeMapAverageSpeed,
    ),
  );

  return {
    firstSimulationAngle: firstAvgVelocityAngle,
    secondSimulationAngle: secondAvgVelocityAngle,
  };
}

export function getAllStatsForLineBar(
  data: StateStatistics[] | undefined,
): LineBarAllStats {
  const roadNames = data && data.length != 0 ? data[0].roadNames : {};

  const currentAverageVelocityByTurn = (data ?? []).map(
    ({ turn, simulationId, currentStatisticsValues }) => ({
      turn,
      entityId: simulationId,
      value: currentStatisticsValues.speedStatistics.wholeMapAverageSpeed,
    }),
  );

  const totalAverageVelocityByTurn = (data ?? []).map(
    ({ turn, simulationId, totalStatisticsValues }) => ({
      turn,
      entityId: simulationId,
      value: totalStatisticsValues.speedStatistics.wholeMapAverageSpeed,
    }),
  );

  const currentFlowMap = mapsToSeriesMap(
    (data ?? []).map(({ turn, currentStatisticsValues }) => ({
      turn,
      data: currentStatisticsValues.roadFlowRatio,
    })),
    'Current Flow',
    roadNames,
  );

  const totalFlowMap = mapsToSeriesMap(
    (data ?? []).map(({ turn, totalStatisticsValues }) => ({
      turn,
      data: totalStatisticsValues.roadFlowRatio,
    })),
    'Total Flow',
    roadNames,
  );

  const currentDensityMap = mapsToSeriesMap(
    (data ?? []).map(({ turn, currentStatisticsValues }) => ({
      turn,
      data: currentStatisticsValues.density,
    })),
    'Current Density',
    roadNames,
  );

  const totalDensityMap = mapsToSeriesMap(
    (data ?? []).map(({ turn, totalStatisticsValues }) => ({
      turn,
      data: totalStatisticsValues.density,
    })),
    'Total Density',
    roadNames,
  );

  const currentRoadAvgVelocityMap = mapsToSeriesMap(
    (data ?? []).map(({ turn, currentStatisticsValues }) => ({
      turn,
      data: currentStatisticsValues.speedStatistics.roadAverageSpeed,
    })),
    'Current Average Velocity',
    roadNames,
  );

  const totalRoadAvgVelocityMap = mapsToSeriesMap(
    (data ?? []).map(({ turn, totalStatisticsValues }) => ({
      turn,
      data: totalStatisticsValues.speedStatistics.roadAverageSpeed,
    })),
    'Total Average Velocity',
    roadNames,
  );

  return {
    currentAverageVelocityByTurn,
    totalAverageVelocityByTurn,
    currentFlowMap,
    totalFlowMap,
    currentDensityMap,
    totalDensityMap,
    currentRoadAvgVelocityMap,
    totalRoadAvgVelocityMap,
  };
}

export function mapsToSeriesMap(
  maps: Array<{ turn: number; data: IdToValue }>,
  label: string,
  roadNames: Record<number, string>,
): Map<number, Series> {
  const ret = new Map<number, Series>();
  const helperMap = new Map<number, Array<{ turn: number; value: number }>>();

  maps.forEach((map) => {
    [...Object.entries(map.data)].forEach(([entityId, value]) => {
      const parsedId = parseInt(entityId);
      if (helperMap.has(parsedId)) {
        helperMap.get(parsedId)?.push({ turn: map.turn, value });
      } else {
        helperMap.set(parsedId, [{ turn: map.turn, value }]);
      }
    });
  });

  [...helperMap.entries()].forEach(([entityId, data]) => {
    ret.set(entityId, {
      label: label + ' for entity: ' + (roadNames[entityId] || entityId),
      data: data.map((x) => ({ ...x, entityId })),
    });
  });

  return ret;
}
