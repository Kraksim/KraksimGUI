interface SpeedStatistics {
  wholeMapAverageSpeed: number,
  roadAverageSpeed: Map<number, number>
}

interface StatisticsValues {
  speedStatistics: SpeedStatistics,
  density: Map<number, number>, //roadId, density
  roadFlowRatio: Map<number, number> //roadId, flowRatio
}

export interface StateStatistics {
  simulationId: number,
  turn: number,
  currentStatisticsValues: StatisticsValues,
  totalStatisticsValues: StatisticsValues,
  entityId: number,
}