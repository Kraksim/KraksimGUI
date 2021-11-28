import { MovementSimulationStrategyType, SimulationType } from '../simulation/types';

const movementLabels: Map<MovementSimulationStrategyType, string> = new Map([
  ['NAGEL_SCHRECKENBERG', 'Nagel Schreckenberg'],
  ['MULTI_LANE_NAGEL_SCHRECKENBERG', 'Multi Lane Nagel'],
]);

const simulationTypeLabels: Map<SimulationType, string> = new Map([
  ['NAGEL_CORE', 'Nagel Core'],
]);

export function labelMovementStrategy(type: MovementSimulationStrategyType): string {
  return movementLabels.get(type) || type;
}
export function labelSimulationType(type: SimulationType): string {
  return simulationTypeLabels.get(type) || type;
}
