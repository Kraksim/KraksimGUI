import { MovementSimulationStrategyType } from '../simulation/types';

interface Position {
  x: number;
  y: number;
}

interface Lane {
  id: number;
  startingPoint: number;
  endingPoint: number;
  indexFromLeft: number;
  name: string;
}

export interface Road {
  length: number;
  lanes: Lane[];
  id: number;
  name: string;
}

interface TurnDirection {
  sourceLane: Lane;
  destinationRoad: Road;
}

export interface RoadNode {
  id: number;
  type: 'INTERSECTION' | 'GATEWAY';
  position: Position;
  endingRoads: Road[];
  startingRoads: Road[];
  turnDirections?: TurnDirection[];
  name: string;
}

export type MapType = 'MAP' | 'NO_MAP';

export interface SimulationMap {
  type: MapType;
  roadNodes: RoadNode[];
  roads: Road[];
  id: number;
  name: string;
  compatibleWith: MovementSimulationStrategyType[];
}

export interface BasicMapInfo {
  type: MapType;
  id: number;
  name: string;
}
