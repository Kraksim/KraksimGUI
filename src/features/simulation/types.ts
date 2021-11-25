import { SimulationMap } from '../map/types';

interface LightPhaseStrategy {
  algorithm: LightAlgorithmType;
  turnLength: number;
  intersections: number[];
  id: number;
}

interface GPS {
  route: number[];
  type: GPSType;
}

export type GPSType = 'DIJKSTRA_ROAD_LENGTH';

interface Car {
  carId: number;
  id: number;
  velocity: number; // todo x5
  currentLaneId?: number;
  positionRelativeToStart: number;
  gps: GPS;
}

export type LightState = 'RED' | 'GREEN';

interface Phase {
  laneId: number;
  phaseTime: number;
  state: LightState;
  id: number;
}

interface LightPhaseStrategy {
  algorithm: LightAlgorithmType;
  turnLength: number;
  intersections: number[];
  id: number;
}

interface TrafficLight {
  intersectionId: number;
  phases: Phase[];
  id: number;
}

interface Generator {
  carsToRelease: number;
  releaseDelay: number;
  targetGatewayId: number;
  gpsType: GPSType;
  lastCarReleasedTurnsAgo: number;
  id: number;
}

interface GatewayState {
  gatewayId: number;
  collectedCars: Car[];
  generators: Generator[];
}

interface SimulationState {
  turn: number;
  carsOnMap: Car[];
  trafficLights: TrafficLight[];
  gatewaysStates: GatewayState[];
  stateType: MovementSimulationStrategyType;
  id: number;
}

interface MovementSimulationStrategy {
  type: MovementSimulationStrategyType;
  randomProvicer: RandomProviderType;
  slowDownProbability: number;
  maxVelocity: number;
  id: number;
}

export interface SimplifiedSimulation {
  mapId: number;
  name: string;
  type: SimulationType;
  id: number;
  isFinished: boolean;
  turn: number;
  movementSimulationStrategyType: MovementSimulationStrategyType;
}

export type SimulationType = 'NAGEL_CORE';

export type MovementSimulationStrategyType =
  | 'NAGEL_SCHRECKENBERG'
  | 'MULTI_LANE_NAGEL_SCHRECKENBERG';

export type RandomProviderType = 'TRUE';

export type LightAlgorithmType = 'TURN_BASED';

export type ExpectedVewlocity = { [k: string]: number };

export interface Simulation {
  mapDTO: SimulationMap;
  simulationStateEntities: SimulationState[];
  movementSimulationStrategy: MovementSimulationStrategy;
  simulationType: SimulationType;
  expectedVelocity: Map<number, number>; // RoadId, Velocity
  lightPhaseStrategies: LightPhaseStrategy[];
  id: number;
}
