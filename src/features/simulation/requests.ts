import {
  GPSType, LightAlgorithmType, LightState, MovementSimulationStrategyType, RandomProviderType, SimulationType, 
} from './types';

export interface SimulateRequest {
  id: number,
  times: number,
}

export interface CreatePhaseRequest {
  laneId: number,
  state: LightState,
}

export interface CreateTrafficLightRequest {
  intersectionId: number,
  phases: CreatePhaseRequest[],
}

export interface CreateGeneratorsRequest {
  releaseDelay: number,
  carsToRelease: number,
  targetGatewayId: number,
  gpsType: GPSType,
}

export interface CreateGatewayStateRequest {
  id: number,
  generators: CreateGeneratorsRequest[],
}

export interface CreateInitialSimulationStateRequest {
  trafficLights: CreateTrafficLightRequest[],
  gatewaysStates: CreateGatewayStateRequest[],
}

export interface CreateMovementSimulationStrategyRequest {
  type: MovementSimulationStrategyType,
  randomProvider: RandomProviderType,
  slowDownProbability: number,
  maxVelocity: number,
}

export interface CreateLightPhaseStrategyRequest {
  algorithm: LightAlgorithmType,
  turnLength: number,
  intersections: number[],
}

export type CreateExpectedVelocityRequest = Map<number, number>;

export interface CreateSimulationRequest {
  name: string,
  mapId: number,
  simulationType: SimulationType,
  expectedVelocity: CreateExpectedVelocityRequest,
  movementSimulationStrategy: CreateMovementSimulationStrategyRequest,
  lightPhaseStrategies: CreateLightPhaseStrategyRequest[],
  initialState: CreateInitialSimulationStateRequest,
}