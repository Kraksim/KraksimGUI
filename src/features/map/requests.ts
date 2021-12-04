import { MovementSimulationStrategyType } from '../simulation/types';

import { MapType } from './types';

export interface CreateMapRequest {
  type: MapType;
  roadNodes: CreateRoadNodeRequest[];
  roads: CreateRoadRequest[];
  compatibleWith: MovementSimulationStrategyType[];
  name: string;
  description: string;
}

export type RoadNodeType = 'INTERSECTION' | 'GATEWAY';

export interface CreateRoadNodeRequest {
  type: RoadNodeType;
  position: CreatePositionRequest;
  endingRoadsIds: number[];
  startingRoadsIds: number[];
  turnDirections?: CreateTurnDirectionRequest[];
  overrideTurnDirectionsTurnEverywhere?: boolean;
  name: string;
}

export interface CreateTurnDirectionRequest {
  sourceLaneId: number,
  destinationRoadId: number
}

export interface CreateRoadRequest {
  length: number;
  lanes: CreateLaneRequest[];
  id: number;
  name: string;
}

export interface CreateLaneRequest{
  startingPoint: number;
  endingPoint: number;
  indexFromLeft: number;
  id: number;
}

export interface CreatePositionRequest{x: number; y: number}