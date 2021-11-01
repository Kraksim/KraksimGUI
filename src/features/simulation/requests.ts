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

interface CreateTrafficLightRequest {
  intersectionId: number,
  phases: CreatePhaseRequest[],
}

export interface CreateGeneratorsRequest {
  releaseDelay: number,
  carsToRelease: number,
  targetGatewayId: number,
  gpsType: GPSType,
}

interface CreateGatewayStateRequest {
  generators: CreateGeneratorsRequest[],
}

interface CreateInitialSimulationStateRequest {
  trafficLights: CreateTrafficLightRequest[],
  gatewaysStates: CreateGatewayStateRequest[],
}

interface CreateMovementSimulationStrategyRequest {
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

export interface CreateSimulationRequest {
  name: string,
  mapId: number,
  simulationType: SimulationType,
  expectedVelocity: Map<number, number>,
  movementSimulationStrategy: CreateMovementSimulationStrategyRequest,
  lightPhaseStrategies: CreateLightPhaseStrategyRequest[],
  initialState: CreateInitialSimulationStateRequest,
}