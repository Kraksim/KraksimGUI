interface SpeedStatistics {
  wholeMapAverageSpeed: number;
  roadAverageSpeed: IdToValue;
}

interface StatisticsValues {
  speedStatistics: SpeedStatistics;
  density: IdToValue; //roadId, density
  roadFlowRatio: IdToValue; //roadId, flowRatio
}

export type IdToValue = Record<number, number>;

export interface StateStatistics {
  simulationId: number;
  turn: number;
  currentStatisticsValues: StatisticsValues;
  totalStatisticsValues: StatisticsValues;
  roadNames: Record<number, string>;
}
