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
import { getGatewaysStatesInitialValues } from './CreateGatewaysStatesForm';

type SimulationBasicInfoFormResult = typeof simulationBasicInfoInitialValues;
type MovmentSimulationStrategyFormResult = typeof movmentSimulationStrategyInitialValues;
type ExpectedVelocityFormResult = typeof expectedVelocityInitialValues;
type LightPhaseStrategiesFormResult = typeof lightPhaseStrategiesInitialValues;
type GatewaysStatesFormResult = ReturnType<typeof getGatewaysStatesInitialValues>;

interface FormValues {
  simulationBasicInfo: SimulationBasicInfoFormResult,
  movmentSimulationStrategy: MovmentSimulationStrategyFormResult,
  expectedVelocity: ExpectedVelocityFormResult,
  lightPhaseStrategies: LightPhaseStrategiesFormResult,
  gatewaysStates: GatewaysStatesFormResult,
}

export interface NameId {
  name: string,
  id: number,
}

function parseExpectedVelocitiesToRequest(result: ExpectedVelocityFormResult): CreateExpectedVelocityRequest{
  const ret = new Map<number, number>();
  result.roadsVelocityPairs
    .flatMap(({ roadIds, velocity }) => roadIds.map(
      (roadId) => ({ roadId: parseInt(roadId), velocity: parseInt(velocity) }),
    ))
    .forEach(({ roadId, velocity }) => ret.set(roadId, velocity));
  return Object.fromEntries(ret.entries());
}

function parseInitialStateToRequest(
  gatewaysResult: GatewaysStatesFormResult,
): CreateInitialSimulationStateRequest {
  
  return {
    gatewaysStates: Object
      .entries(gatewaysResult)
      .filter(([, value]) => value.generators
        .every(({
          carsToRelease, gpsType, releaseDelay, targetGatewayId, 
        }) => notEmptyString([carsToRelease, gpsType, releaseDelay, targetGatewayId])))
      .map(([key, value]) => ({
        gatewayId: parseInt(key),
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

function hasLengthAndDefined(x: string | undefined){
  return x && x !== ''; 
}

function parseLightPhaseStrategiesToRequest(result: LightPhaseStrategiesFormResult): CreateLightPhaseStrategyRequest[] {
  return result
    .filter(
      ({
        algorithm, turnLength, intersections, phiFactor, minPhaseLength,
      }) => 
        notEmptyString([algorithm]) && 
        (notEmptyString([phiFactor, minPhaseLength]) || notEmptyString([turnLength])) && intersections.length > 0, 
    )
    .map(({
      algorithm, turnLength, intersections, phiFactor, minPhaseLength,
    }) => ({
      algorithm: algorithm as LightAlgorithmType,
      turnLength: algorithm === 'TURN_BASED' && 
        hasLengthAndDefined(turnLength) ? parseInt(turnLength as string) : undefined,
      phiFactor: algorithm === 'SOTL' && 
        hasLengthAndDefined(phiFactor) ? parseFloat(phiFactor as string) : undefined,
      minPhaseLength: algorithm === 'SOTL' && 
        hasLengthAndDefined(minPhaseLength) ? parseInt(minPhaseLength as string) : undefined,
      intersections: intersections.map(id => parseInt(id)),

    }));
}

export function parseFormResultToRequest(result: FormValues, mapId: number): CreateSimulationRequest {
  return {
    mapId,
    name: result.simulationBasicInfo.name,
    simulationType: result.simulationBasicInfo.simulationType as SimulationType,
    expectedVelocity: parseExpectedVelocitiesToRequest(result.expectedVelocity),
    initialState: parseInitialStateToRequest(result.gatewaysStates),
    movementSimulationStrategy: parseMovmentSimulationStrategyToRequest(result.movmentSimulationStrategy),
    lightPhaseStrategies: parseLightPhaseStrategiesToRequest(result.lightPhaseStrategies),
  };
}