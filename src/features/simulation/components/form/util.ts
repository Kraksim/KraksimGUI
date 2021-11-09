import {
  CreateSimulationRequest, 
  CreateInitialSimulationStateRequest, 
  CreateExpectedVelocityRequest, 
  CreateMovementSimulationStrategyRequest,
  CreateLightPhaseStrategyRequest,
} from '../../requests';
import {
  SimulationType, MovementSimulationStrategyType, RandomProviderType, LightAlgorithmType, 
} from '../../types';

import { expectedVelocityInitialValues } from './CreateExpectedVelocityMapForm';
import { lightPhaseStrategiesInitialValues } from './CreateLightPhaseStrategiesForm';
import { movmentSimulationStrategyInitialValues } from './CreateMovmentSimulationStrategyForm';
import { simulationBasicInfoInitialValues } from './CreateSimulationBasicInfoForm';
import { getTrafficLightsInitialValues } from './CreateTrafficLightsForm';
import { getGatewaysStatesInitialValues } from './CreateGatewaysStatesForm';

type SimulationBasicInfoFormResult = typeof simulationBasicInfoInitialValues;
type MovmentSimulationStrategyFormResult = typeof movmentSimulationStrategyInitialValues;
type ExpectedVelocityFormResult = typeof expectedVelocityInitialValues;
type LightPhaseStrategiesFormResult = typeof lightPhaseStrategiesInitialValues;
type TrafficLightsFormResult =  ReturnType<typeof getTrafficLightsInitialValues>;
type GatewaysStatesFormResult = ReturnType<typeof getGatewaysStatesInitialValues>;

interface FormValues {
  simulationBasicInfo: SimulationBasicInfoFormResult,
  movmentSimulationStrategy: MovmentSimulationStrategyFormResult,
  expectedVelocity: ExpectedVelocityFormResult,
  lightPhaseStrategies: LightPhaseStrategiesFormResult,
  trafficLights: TrafficLightsFormResult,
  gatewaysStates: GatewaysStatesFormResult,
}

function parseExpectedVelocitiesToRequest(result: ExpectedVelocityFormResult): CreateExpectedVelocityRequest{
  const ret = new Map<number, number>();
  result.roadVelocityPairs
    .map(({ roadId, velocity }) => ({ roadId: parseInt(roadId), velocity: parseInt(velocity) }))
    .forEach(({ roadId, velocity }) => ret.set(roadId, velocity));
  return ret;
}

function parseInitialStateToRequest(
  gatewaysResult: GatewaysStatesFormResult, trafficLightResult: TrafficLightsFormResult,
): CreateInitialSimulationStateRequest {
  
  return {
    trafficLights: Object.entries(trafficLightResult)
      .filter(([, value]) => value.phases.length > 0).map(([key, value]) => ({
        intersectionId: parseInt(key),
        phases: value.phases,
      })),

    gatewaysStates: Object
      .entries(gatewaysResult)
      .filter(([, value]) => value.generators
        .every(({
          carsToRelease, gpsType, releaseDelay, targetGatewayId, 
        }) => notEmptyString([carsToRelease, gpsType, releaseDelay, targetGatewayId])))
      .map(([key, value]) => ({
        id: parseInt(key),
        generators: value.generators, 
      })),
  };
}

function parseMovmentSimulationStrategyToRequest(
  result: MovmentSimulationStrategyFormResult,
): CreateMovementSimulationStrategyRequest{
  return {
    type: result.type as MovementSimulationStrategyType,
    slowDownProbability: parseInt(result.slowDownProbability) / 100,
    maxVelocity: parseInt(result.maxVelocity),
    randomProvider: result.randomProvider as RandomProviderType,
  };
}

function notEmptyString(objects: any[]): boolean{
  return objects.every(obj => obj !== '');
}

function parseLightPhaseStrategiesToRequest(result: LightPhaseStrategiesFormResult): CreateLightPhaseStrategyRequest[] {
  return result
    .filter(
      ({ algorithm, turnLength, intersections }) => 
        notEmptyString([algorithm, turnLength]) && intersections.length > 0, 
    )
    .map(({ algorithm, turnLength, intersections }) => ({
      algorithm: algorithm as LightAlgorithmType,
      turnLength: parseInt(turnLength),
      intersections: intersections.map(id => parseInt(id)),
    }));
}

export function parseFormResultToRequest(result: FormValues, mapId: number): CreateSimulationRequest {
  return {
    mapId,
    name: result.simulationBasicInfo.name,
    simulationType: result.simulationBasicInfo.simulationType as SimulationType,
    expectedVelocity: parseExpectedVelocitiesToRequest(result.expectedVelocity),
    initialState: parseInitialStateToRequest(result.gatewaysStates, result.trafficLights),
    movementSimulationStrategy: parseMovmentSimulationStrategyToRequest(result.movmentSimulationStrategy),
    lightPhaseStrategies: parseLightPhaseStrategiesToRequest(result.lightPhaseStrategies),
  };
}