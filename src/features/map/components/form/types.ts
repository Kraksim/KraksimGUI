import { MovementSimulationStrategyType } from '../../../simulation/types';
import { CreateRoadNodeRequest, CreateRoadRequest } from '../../requests';

export type FocusedElementType = 'INTERSECTION' | 'GATEWAY' | 'ROAD';

type RoadNodePartialFields =  'id' | 'name' | 'position' | 'endingRoadsIds' | 'startingRoadsIds' | 'type';

export type PartialGateway = Pick<CreateRoadNodeRequest, RoadNodePartialFields>;

export type PartialIntersection = Pick<CreateRoadNodeRequest, 
RoadNodePartialFields | 'overrideTurnDirectionsTurnEverywhere' | 'turnDirections'>;

export type PartialRoad = CreateRoadRequest;

export interface FocusedElement {
  type: FocusedElementType;
  id: number
}

export interface InitialMapFormValues {
  gateways: Record<number, PartialGateway>,
  intersections: Record<number, PartialIntersection>,
  roads: Record<number, PartialRoad>,
  name: string;
  description: string;
  compatibleWith: MovementSimulationStrategyType[];
}