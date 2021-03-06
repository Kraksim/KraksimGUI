import {
  GPSType,
  LightAlgorithmType,
  MovementSimulationStrategyType,
  RandomProviderType,
  SimulationType,
} from './types';

export interface SimulateRequest {
  id: number;
  times: number;
}

export interface CreateGeneratorsRequest {
  releaseDelay: number;
  carsToRelease: number;
  targetGatewayId: number;
  gpsType: GPSType;
}

export interface CreateGatewayStateRequest {
  gatewayId: number;
  generators: CreateGeneratorsRequest[];
}

export interface CreateInitialSimulationStateRequest {
  gatewaysStates: CreateGatewayStateRequest[];
}

export interface CreateMovementSimulationStrategyRequest {
  type: MovementSimulationStrategyType;
  randomProvider: RandomProviderType;
  slowDownProbability: number;
  maxVelocity: number;
  threshold?: number;
  accelerationDelayProbability?: number;
  breakLightReactionProbability?: number;
}

export interface CreateLightPhaseStrategyRequest {
  algorithm: LightAlgorithmType;
  turnLength?: number;
  phiFactor?: number;
  minPhaseLength?: number;
  intersections: number[];
}

export type CreateExpectedVelocityRequest = { [k: string]: number };

export interface CreateSimulationRequest {
  name: string;
  mapId: number;
  simulationType: SimulationType;
  expectedVelocity: CreateExpectedVelocityRequest;
  movementSimulationStrategy: CreateMovementSimulationStrategyRequest;
  lightPhaseStrategies: CreateLightPhaseStrategyRequest[];
  initialState: CreateInitialSimulationStateRequest;
}

export interface Result {
  type: ResultType;
}

export type ResultType = 'FINISHED' | 'STILL_SIMULATING';
